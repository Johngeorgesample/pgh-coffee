import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// next/og only bundles Noto Sans *regular*, so every `fontWeight: 700` in an OG
// card silently renders at regular weight until a bold face is supplied here.
// Dynamic OG routes also need these listed in `outputFileTracingIncludes`
// (next.config.js) — file tracing doesn't follow readFileSync(process.cwd()).
const interRegular = readFileSync(join(process.cwd(), 'public', 'Inter-Regular.ttf'))
const interBold = readFileSync(join(process.cwd(), 'public', 'Inter-Bold.ttf'))

// Supplying `fonts` replaces the default font entirely, so 400 has to be here too.
export const ogFonts = [
  { name: 'Inter', data: interRegular, weight: 400 as const, style: 'normal' as const },
  { name: 'Inter', data: interBold, weight: 700 as const, style: 'normal' as const },
]
