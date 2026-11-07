import { OG_COLORS, OG_IMAGE_SIZE, getOgLogoSrc, OG_NO_PHOTO_BACKGROUND } from '@/app/utils/ogTheme'

/* eslint-disable @next/next/no-img-element */

function Background({ photo }: { photo: string | null }) {
  if (!photo) return <div style={{ ...OG_NO_PHOTO_BACKGROUND, display: 'flex', width: '100%', height: '100%' }} />
  return <img src={photo} width={OG_IMAGE_SIZE.width} height={OG_IMAGE_SIZE.height} alt="" style={{ objectFit: 'cover' }} />
}

function Header() {
  const logoSrc = getOgLogoSrc()

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
        background: OG_COLORS.yellow,
        padding: '20px 56px',
        fontSize: 44,
        fontWeight: 700,
        color: OG_COLORS.gray900,
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
        width: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        background: 'white',
        padding: '28px 40px',
        borderLeft: `12px solid ${OG_COLORS.yellow}`,
      }}
    >
      <div style={{ fontSize: 58, fontWeight: 700, color: OG_COLORS.gray900, lineHeight: 1.1 }}>{title}</div>
      <div style={{ fontSize: 30, color: OG_COLORS.gray500 }}>{subtitle}</div>
    </div>
  )
}

export function OgPhotoCard({ photo, title, subtitle }: { photo: string | null; title: string; subtitle: string }) {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', position: 'relative' }}>
      <Background photo={photo} />
      {/* Keeps the card readable against a bright or busy photo. */}
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
      <InfoCard title={title} subtitle={subtitle} />
    </div>
  )
}
