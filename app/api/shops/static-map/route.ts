import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

// Don't let Next apply a fixed ISR window; the Cache-Control below drives CDN
// caching instead.
export const dynamic = 'force-dynamic'

const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN

// Fixed server-side so the cache key space stays small and the route can't be
// used to generate arbitrary (quota-burning) images. Matches the main map
// (dark-v11) and ShopLocation's yellow-dot overlay.
const STYLE = 'dark-v11'
const SIZE = '600x320@2x'
const ZOOM = 14

// Padded Allegheny County bounding box. Requests outside it are rejected so the
// proxy only ever spends our Mapbox quota on shops we actually map.
const BOUNDS = { minLng: -80.5, maxLng: -79.6, minLat: 40.1, maxLat: 40.8 }

const inBounds = (lng: number, lat: number) =>
  lng >= BOUNDS.minLng && lng <= BOUNDS.maxLng && lat >= BOUNDS.minLat && lat <= BOUNDS.maxLat

// Round to ~1m so trivially-different coordinates share a cached image.
const round = (n: number) => Math.round(n * 1e5) / 1e5

export async function GET(req: NextRequest) {
  if (!MAPBOX_TOKEN) {
    return NextResponse.json({ error: 'Mapbox token not configured' }, { status: 500 })
  }

  const params = req.nextUrl.searchParams
  const lng = Number(params.get('lng'))
  const lat = Number(params.get('lat'))

  if (!Number.isFinite(lng) || !Number.isFinite(lat) || !inBounds(lng, lat)) {
    return NextResponse.json({ error: 'Invalid or out-of-area coordinates' }, { status: 400 })
  }

  const center = `${round(lng)},${round(lat)}`
  const url = `https://api.mapbox.com/styles/v1/mapbox/${STYLE}/static/${center},${ZOOM},0/${SIZE}?access_token=${MAPBOX_TOKEN}`

  const upstream = await fetch(url)
  if (!upstream.ok) {
    logger.error('Mapbox static image request failed', { status: String(upstream.status) })
    return NextResponse.json({ error: 'Failed to fetch map image' }, { status: 502 })
  }

  const body = await upstream.arrayBuffer()
  return new NextResponse(body, {
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'image/png',
      // A coordinate's map image is effectively immutable, so cache hard: long
      // shared-CDN TTL absorbs traffic, and a day of browser cache spares repeat
      // viewers a round-trip.
      'Cache-Control': 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400',
    },
  })
}
