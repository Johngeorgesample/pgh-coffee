import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const OG_COLORS = {
  yellow: '#fde047', // matches nav bg-yellow-300
  gray900: '#111827',
  gray500: '#6b7280',
} as const

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const
export const OG_CONTENT_TYPE = 'image/png'

// Anything read this way must also be listed under `outputFileTracingIncludes`
// in next.config.js, per dynamic OG route that renders it — tracing doesn't
// follow readFileSync(process.cwd(), …) into the bundle, and the miss only
// shows up as a 500 in production.
const readPublicImageAsDataUri = (filename: string) =>
  `data:image/png;base64,${readFileSync(join(process.cwd(), 'public', filename)).toString('base64')}`

// Not React's cache(): that's scoped per-request, which would re-read the
// asset on every request instead of reusing a warm instance's first read.
function once(fn: () => string) {
  let cached: string | undefined
  return () => (cached ??= fn())
}

// Both logo variants are lazy: a route only pays to read and base64-encode
// whichever asset it actually renders, and only on the first call.
export const getOgLogoSrc = once(() => readPublicImageAsDataUri('logo_with_no_text_transparent_108.png'))

// Full-size (2000px) variant, for an oversized watermark that stays crisp.
export const getOgWatermarkSrc = once(() => readPublicImageAsDataUri('logo_with_no_text_transparent.png'))

// Cream + dot grid: passport-page texture instead of stark white, shared by
// every OG image that has no photo to show so they read as one family. SVG
// tile because satori doesn't tile radial-gradient patterns.
export const OG_NO_PHOTO_BACKGROUND = {
  backgroundColor: '#fffbeb',
  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><circle cx='4' cy='4' r='2.5' fill='#e0ddd2'/></svg>`,
  )}")`,
  backgroundSize: '32px 32px',
  backgroundRepeat: 'repeat',
}
