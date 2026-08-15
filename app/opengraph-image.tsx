import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { ogFonts } from '@/app/utils/ogFonts'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'pgh.coffee — a guide to independent coffee in Pittsburgh, PA'

const logoSrc = `data:image/png;base64,${readFileSync(
  join(process.cwd(), 'public', 'logo_with_no_text_transparent_108.png'),
).toString('base64')}`

const yellow = '#fde047' // matches nav bg-yellow-300
const gray900 = '#111827'
const gray500 = '#6b7280'

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: 'white' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: yellow,
            padding: '24px 64px',
            fontSize: 40,
            fontWeight: 700,
            color: gray900,
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
          <div style={{ fontSize: 64, fontWeight: 700, color: gray900 }}>
            Pittsburgh&apos;s independent coffee map
          </div>
          <div style={{ fontSize: 34, color: gray500 }}>
            Explore shops across the city&apos;s neighborhoods and track your visits.
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: gray900 }}>Find your next favorite shop &rarr;</div>
        </div>
      </div>
    ),
    { ...size, fonts: ogFonts },
  )
}
