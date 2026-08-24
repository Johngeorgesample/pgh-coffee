import { ImageResponse } from 'next/og'
import { logger } from '@/lib/logger'
import { getPublicProfile } from '@/app/utils/profiles'
import { computeStats } from '@/app/utils/visitStats'
import { OG_COLORS, OG_IMAGE_SIZE, OG_CONTENT_TYPE, getOgLogoSrc, OG_NO_PHOTO_BACKGROUND, getOgWatermarkSrc } from '@/app/utils/ogTheme'
import { getClient } from '@/lib/supabase/server-client'

export const size = OG_IMAGE_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'pgh.coffee passport'

function Stat({ value, label, valueSize = 64 }: { value: string; label: string; valueSize?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{ fontSize: valueSize, fontWeight: 700, color: OG_COLORS.gray900 }}>{value}</div>
      <div style={{ fontSize: 28, color: OG_COLORS.gray500 }}>{label}</div>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  const logoSrc = getOgLogoSrc()
  const watermarkSrc = getOgWatermarkSrc()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        ...OG_NO_PHOTO_BACKGROUND,
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
          background: OG_COLORS.yellow,
          padding: '24px 64px',
          fontSize: '4.5rem',
          fontWeight: 700,
          color: OG_COLORS.gray900,
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
  const supabase = getClient()
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
          <div style={{ fontSize: 56, fontWeight: 700, color: OG_COLORS.gray900 }}>
            Pittsburgh&apos;s independent coffee map
          </div>
        </Card>
      ),
      size,
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
          <div style={{ fontSize: 72, fontWeight: 700, color: OG_COLORS.gray900 }}>{name}</div>
          <div style={{ fontSize: 32, color: OG_COLORS.gray500 }}>Coffee passport</div>
        </div>
        <div style={{ display: 'flex', gap: 80 }}>
          <Stat value={`${stats.visited} of ${stats.total}`} label="shops visited" />
          <Stat value={`${stats.neighborhoodsVisited} of ${stats.totalNeighborhoods}`} label="neighborhoods" />
          {stats.topNeighborhood && (
            <Stat value={stats.topNeighborhood} label="top neighborhood" valueSize={40} />
          )}
        </div>
        <div style={{ fontSize: 30, fontWeight: 600, color: OG_COLORS.gray900 }}>
          Track your own coffee passport at pgh.coffee &rarr;
        </div>
      </Card>
    ),
    size,
  )
}
