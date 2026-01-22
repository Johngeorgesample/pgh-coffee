import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { formatDBShopAsFeature } from '@/app/utils/utils'
import { DbShop } from '@/types/shop-types'

// Disable Next's fixed ISR window; we'll control TTL via Cache-Control
export const revalidate = 0

const TZ = 'America/New_York'

// YYYY-MM-DD in a specific timezone
function ymdInTz(d = new Date(), tz = TZ) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d) // e.g. 2025-08-20
}

// e.g. "-04:00" or "-05:00" for ET (handles DST)
function tzOffsetString(d = new Date(), tz = TZ) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    timeZoneName: 'shortOffset',
  }).formatToParts(d)
  const tzName = parts.find(p => p.type === 'timeZoneName')?.value || 'GMT-05'
  // "GMT-4" or "GMT-05:00" → normalize to "-04:00"/"-05:00"
  const m = tzName.match(/GMT([+-]\d{1,2})(?::?(\d{2}))?/)
  if (!m) return '-05:00'
  const hh = String(Math.abs(parseInt(m[1], 10))).padStart(2, '0')
  const sign = parseInt(m[1], 10) < 0 ? '-' : '+'
  const mm = m[2] ? m[2] : '00'
  return `${sign}${hh}:${mm}`
}

// Seconds until next midnight in tz
function secondsUntilNextMidnightTz(now = new Date(), tz = TZ) {
  const today = ymdInTz(now, tz)
  const offset = tzOffsetString(now, tz)
  // Construct today's midnight in tz, then add 1 day if we've passed it
  let nextMidnight = new Date(`${today}T00:00:00${offset}`)
  if (now.getTime() >= nextMidnight.getTime()) {
    const [y, m, d] = today.split('-').map(Number)
    const dt = new Date(Date.UTC(y, m - 1, d + 1, 0, 0, 0))
    const nextYMD = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(dt)
    nextMidnight = new Date(`${nextYMD}T00:00:00${offset}`)
  }
  return Math.max(1, Math.round((nextMidnight.getTime() - now.getTime()) / 1000))
}

function daySeed(d = new Date()) {
  const ymd = ymdInTz(d, TZ) // <- flips at ET midnight
  const hex = crypto.createHash('sha1').update(ymd).digest('hex').slice(0, 8)
  return parseInt(hex, 16)
}

export async function GET() {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

  const { count, error: countErr } = await supabase.from('shops').select('uuid', { count: 'exact', head: true })

  if (countErr || !count) {
    return NextResponse.json({ error: 'No shops found' }, { status: 500 })
  }

  const idx = daySeed() % count

  const { data, error } = await supabase
    .from('shops')
    .select('uuid,name,neighborhood,address,website,photo,photos,roaster,latitude,longitude,company:company_id(*)')
    .order('name', { ascending: true })
    .range(idx, idx)

  if (error || !data?.[0]) {
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }

  const row = data[0]
  const shop: DbShop = {
    ...row,
    company: Array.isArray(row.company) ? row.company[0] ?? null : row.company,
  }
  const base = formatDBShopAsFeature(shop)
  const feature = {
    ...base,
    properties: {
      ...base.properties,
      roaster: shop.roaster ?? '',
    },
  }

  const ttl = secondsUntilNextMidnightTz() // cache until next ET midnight

  return NextResponse.json(feature, {
    headers: {
      // s-maxage for your CDN/proxy; stale-while-revalidate for a soft buffer
      'Cache-Control': `public, max-age=0, s-maxage=${ttl}, stale-while-revalidate=60`,
    },
  })
}
