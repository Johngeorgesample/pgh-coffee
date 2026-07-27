import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { getShopForSeo } from '@/app/utils/seo'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'pgh.coffee shop'

const logoSrc = `data:image/png;base64,${readFileSync(
  join(process.cwd(), 'public', 'logo_with_no_text_transparent_108.png'),
).toString('base64')}`

const yellow = '#fde047' // matches nav bg-yellow-300
const gray900 = '#111827'
const gray500 = '#6b7280'

// Cream + dot grid stands in for the photo when a shop has none, matching the
// passport OG image. Satori won't tile a radial-gradient, hence the SVG tile.
const noPhotoBackground = {
  backgroundColor: '#fffbeb',
  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><circle cx='4' cy='4' r='2.5' fill='#e0ddd2'/></svg>`,
  )}")`,
  backgroundSize: '32px 32px',
  backgroundRepeat: 'repeat',
}

/* eslint-disable @next/next/no-img-element */

function Background({ photo }: { photo: string | null }) {
  if (!photo) return <div style={{ ...noPhotoBackground, display: 'flex', width: '100%', height: '100%' }} />
  return <img src={photo} width={size.width} height={size.height} alt="" style={{ objectFit: 'cover' }} />
}

function Header() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: yellow,
        padding: '20px 56px',
        fontSize: 44,
        fontWeight: 700,
        color: gray900,
      }}
    >
      <img src={logoSrc} width={44} height={44} alt="" />
      pgh.coffee
    </div>
  )
}

function InfoCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 48,
        bottom: 44,
        maxWidth: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        background: 'white',
        padding: '28px 40px',
        borderLeft: `12px solid ${yellow}`,
      }}
    >
      <div style={{ fontSize: 58, fontWeight: 700, color: gray900, lineHeight: 1.1 }}>{title}</div>
      <div style={{ fontSize: 30, color: gray500 }}>{subtitle}</div>
    </div>
  )
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const shop = await getShopForSeo((await params).slug)

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', position: 'relative' }}>
        <Background photo={shop?.photo ?? null} />
        {/* Keeps the card readable against a bright or busy storefront photo. */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 100%)',
          }}
        />
        <Header />
        <InfoCard
          title={shop?.name ?? 'pgh.coffee'}
          subtitle={shop?.address ?? "Pittsburgh's independent coffee map"}
        />
      </div>
    ),
    size,
  )
}
