import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ReactNode } from 'react'
import { ImageResponse } from 'next/og'
import { ogFonts } from '@/app/utils/ogFonts'
import { OG_IMAGE_SIZE, readPublicImageAsDataUri } from '@/app/utils/ogTheme'

const INK = '#030712'
const YELLOW = '#fde047'
export const ADVENT_OG_CARD = { border: `4px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}` }

const serif = { name: 'Gelasio', data: readFileSync(join(process.cwd(), 'public', 'Gelasio-Regular.woff')), weight: 400 as const, style: 'normal' as const }

const Strip = ({ src, width, shift }: { src: string; width: number; shift: number }) => (
  <div style={{ display: 'flex', height: 315, marginLeft: shift }}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={src} height={315} width={width} alt="" />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={src} height={315} width={width} alt="" />
  </div>
)

const Wallpaper = () => (
  <div style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630, display: 'flex', flexDirection: 'column' }}>
    <Strip src={readPublicImageAsDataUri('advent/og/top.jpg')} width={1134} shift={-120} />
    <Strip src={readPublicImageAsDataUri('advent/og/right.jpg')} width={1110} shift={-520} />
    <div style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630, background: 'rgba(255,255,255,0.8)' }} />
  </div>
)

const Pitch = ({ headline, headlineSize, subline }: { headline: string; headlineSize: number; subline: string }) => (
  <div
    style={{
      ...ADVENT_OG_CARD,
      display: 'flex',
      flexDirection: 'column',
      width: 660,
      marginRight: -56,
      padding: '40px 48px',
      borderRadius: 32,
      background: YELLOW,
      transform: 'rotate(-2deg)',
      color: INK,
    }}
  >
    <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>
      Pittsburgh Coffee Advent Calendar · 2026
    </div>
    <div style={{ marginTop: 20, fontFamily: 'Gelasio', fontSize: headlineSize, lineHeight: 1.04, letterSpacing: -1.5 }}>{headline}</div>
    <div style={{ marginTop: 22, fontSize: 24, lineHeight: 1.35 }}>{subline}</div>
    <div style={{ marginTop: 26, fontSize: 22, fontWeight: 700 }}>pgh.coffee/advent</div>
  </div>
)

export const renderAdventOg = ({ headline, headlineSize = 64, subline, art }: { headline: string; headlineSize?: number; subline: string; art: ReactNode }) =>
  new ImageResponse(
    (
      <div style={{ position: 'relative', display: 'flex', width: '100%', height: '100%', background: 'white' }}>
        <Wallpaper />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row-reverse', width: '100%', height: '100%' }}>
          {art}
          <Pitch headline={headline} headlineSize={headlineSize} subline={subline} />
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE, fonts: [...ogFonts, serif] },
  )
