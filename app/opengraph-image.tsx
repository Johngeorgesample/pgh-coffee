/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og'
import { ogFonts } from '@/app/utils/ogFonts'
import { OG_COLORS, OG_IMAGE_SIZE, OG_CONTENT_TYPE, getOgLogoSrc } from '@/app/utils/ogTheme'
import { MapView, staticMapUrl, toMapPixel } from '@/app/utils/ogMap'
import { getAllShopsForSeo } from '@/app/utils/seo'

export const size = OG_IMAGE_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'pgh.coffee — a guide to independent coffee in Pittsburgh, PA'

const VIEW: MapView = { lng: -80.105, lat: 40.445, zoom: 10.9, ...OG_IMAGE_SIZE }
const DOT = 14

type Point = { lng: number; lat: number }

function Map({ points }: { points: Point[] }) {
  const token = process.env.MAPBOX_ACCESS_TOKEN
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: VIEW.width, height: VIEW.height, display: 'flex', background: '#1a1a1a' }}>
      {token && <img src={staticMapUrl(VIEW, token)} width={VIEW.width} height={VIEW.height} alt="" />}
      {points.map((p, i) => {
        const { left, top } = toMapPixel(VIEW, p.lng, p.lat)
        return (
          <div
            key={i}
            style={{ position: 'absolute', left: left - DOT / 2, top: top - DOT / 2, width: DOT, height: DOT, borderRadius: 999, background: OG_COLORS.yellow, border: '2px solid rgba(0,0,0,0.6)' }}
          />
        )
      })}
    </div>
  )
}

function Wordmark() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 56, fontWeight: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 87, height: 87, borderRadius: 10, background: OG_COLORS.yellow }}>
        <img src={getOgLogoSrc()} width={56} height={56} alt="" />
      </div>
      pgh.coffee
    </div>
  )
}

export default async function Image() {
  const shops = await getAllShopsForSeo()
  const neighborhoods = new Set(shops.map((s) => s.neighborhood)).size
  const points = shops.flatMap((s) => (s.latitude != null && s.longitude != null ? [{ lng: s.longitude, lat: s.latitude }] : []))

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', position: 'relative', fontFamily: 'Inter', color: 'white' }}>
        <Map points={points} />
        <div
          style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: 760, display: 'flex',
            backgroundImage: 'linear-gradient(to right, rgba(18,18,18,0.94) 0%, rgba(18,18,18,0.8) 55%, rgba(18,18,18,0) 100%)',
          }}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 620, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 72px' }}>
          <Wordmark />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.04, letterSpacing: -2 }}>Pittsburgh&apos;s independent coffee map</div>
            <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.7)' }}>{`${shops.length} shops · ${neighborhoods} neighborhoods`}</div>
          </div>
        </div>
        <div style={{ position: 'absolute', right: 16, bottom: 10, display: 'flex', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>© Mapbox © OpenStreetMap</div>
      </div>
    ),
    { ...size, fonts: ogFonts },
  )
}
