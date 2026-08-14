import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { ogFonts } from '@/app/utils/ogFonts'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'
import { getPublicProfile } from '@/app/utils/profiles'
import { computeStats } from '@/app/utils/visitStats'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'pgh.coffee passport'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const logoSrc = `data:image/png;base64,${readFileSync(
  join(process.cwd(), 'public', 'logo_with_no_text_transparent_108.png'),
).toString('base64')}`

// Full-size (2000px) logo so the oversized watermark stays crisp.
const watermarkSrc = `data:image/png;base64,${readFileSync(
  join(process.cwd(), 'public', 'logo_with_no_text_transparent.png'),
).toString('base64')}`

const yellow = '#fde047' // matches nav bg-yellow-300
const gray900 = '#111827'
const gray500 = '#6b7280'

function Stat({
  value,
  label,
  valueSize = 64,
  maxWidth,
}: {
  value: string
  label: string
  valueSize?: number
  maxWidth?: number
}) {
  return (
    // Spread rather than `maxWidth` directly: satori throws on an undefined
    // style value instead of ignoring it.
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', ...(maxWidth && { maxWidth }) }}>
      <div style={{ fontSize: valueSize, fontWeight: 700, color: gray900 }}>{value}</div>
      <div style={{ fontSize: 28, color: gray500 }}>{label}</div>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        // Cream + dot grid: passport-page texture instead of stark white.
        // SVG tile because satori doesn't tile radial-gradient patterns.
        backgroundColor: '#fffbeb',
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><circle cx='4' cy='4' r='2.5' fill='#e0ddd2'/></svg>`,
        )}")`,
        backgroundSize: '32px 32px',
        backgroundRepeat: 'repeat',
      }}
    >
      {/* Faint keystone watermark; header and stats draw over it. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={watermarkSrc}
        width={520}
        height={520}
        alt=""
        style={{ position: 'absolute', right: -70, bottom: -90, opacity: 0.06 }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          background: yellow,
          padding: '24px 64px',
          fontSize: '4.5rem',
          fontWeight: 700,
          color: gray900,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={90} height={90} alt="" />
        pgh.coffee
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'center',
          padding: '0 64px',
          gap: 48,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [profile, { data: shops, error: shopsError }] = await Promise.all([
    getPublicProfile(id),
    supabase.from('shops').select('neighborhood'),
  ])

  // Fail loudly rather than render "69 of 0": social crawlers cache the image,
  // so a transient DB error would be presented as truth long after it resolves.
  if (shopsError) {
    logger.error('Error fetching shop totals for OG image', { error: shopsError.message })
    throw new Error('Failed to load shop totals')
  }

  if (!profile) {
    return new ImageResponse(
      (
        <Card>
          <div style={{ fontSize: 56, fontWeight: 700, color: gray900 }}>
            Pittsburgh&apos;s independent coffee map
          </div>
        </Card>
      ),
      { ...size, fonts: ogFonts },
    )
  }

  const total = shops?.length ?? 0
  const totalNeighborhoods = new Set(shops?.map((s) => s.neighborhood).filter(Boolean)).size
  const stats = computeStats(profile.visits, total, totalNeighborhoods)
  const name = profile.displayName || 'Coffee lover'

  return new ImageResponse(
    (
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 72, fontWeight: 700, color: gray900 }}>{name}</div>
          <div style={{ fontSize: 32, color: gray500 }}>Coffee passport</div>
        </div>
        <div style={{ display: 'flex', gap: 80 }}>
          <Stat value={`${stats.visited} of ${stats.total}`} label="shops visited" />
          <Stat value={`${stats.neighborhoodsVisited} of ${stats.totalNeighborhoods}`} label="neighborhoods" />
          {stats.topNeighborhood && (
            // Wraps rather than running off the card: "Central Lawrenceville"
            // is wider than the space three stats leave.
            <Stat value={stats.topNeighborhood} label="top neighborhood" valueSize={40} maxWidth={340} />
          )}
        </div>
        <div style={{ fontSize: 30, fontWeight: 700, color: gray900 }}>
          Track your own coffee passport at pgh.coffee &rarr;
        </div>
      </Card>
    ),
    { ...size, fonts: ogFonts },
  )
}
