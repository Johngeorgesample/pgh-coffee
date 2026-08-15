import { ImageResponse } from 'next/og'
import { OG_COLORS, OG_IMAGE_SIZE, OG_CONTENT_TYPE, getOgLogoSrc } from '@/app/utils/ogTheme'

export const size = OG_IMAGE_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'pgh.coffee — a guide to independent coffee in Pittsburgh, PA'

export default function Image() {
  const logoSrc = getOgLogoSrc()
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: 'white' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: OG_COLORS.yellow,
            padding: '24px 64px',
            fontSize: 40,
            fontWeight: 700,
            color: OG_COLORS.gray900,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={48} height={48} alt="" />
          pgh.coffee
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            justifyContent: 'center',
            padding: '0 64px',
            gap: 32,
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 700, color: OG_COLORS.gray900 }}>
            Pittsburgh&apos;s independent coffee map
          </div>
          <div style={{ fontSize: 34, color: OG_COLORS.gray500 }}>
            Explore shops across the city&apos;s neighborhoods and track your visits.
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, color: OG_COLORS.gray900 }}>Find your next favorite shop &rarr;</div>
        </div>
      </div>
    ),
    size,
  )
}
