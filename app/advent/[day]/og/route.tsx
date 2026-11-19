import { NextRequest } from 'next/server'
import { ADVENT_OG_CARD, renderAdventOg } from '@/app/utils/adventOg'
import { readPublicImageAsDataUri } from '@/app/utils/ogTheme'
import { parseDayParam } from '@/app/utils/advent'
import { findOrder, stepOf } from '@/data/advent-orders'

const JarLabel = ({ jar }: { jar: number }) => (
  <div style={{ ...ADVENT_OG_CARD, display: 'flex', borderRadius: '50%', overflow: 'hidden', transform: 'rotate(3deg)' }}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={readPublicImageAsDataUri(`advent/og/labels/${jar}.jpg`)} width={380} height={380} alt="" />
  </div>
)

export async function GET(request: NextRequest, { params }: { params: Promise<{ day: string }> }) {
  const jar = parseDayParam((await params).day)
  if (!jar) return new Response('Not found', { status: 404 })
  const step = stepOf(findOrder(request.nextUrl.searchParams.get('order') ?? undefined), jar)
  return renderAdventOg({
    headline: `Day ${String(step).padStart(2, '0')}`,
    headlineSize: 132,
    subline: "One jar from a Pittsburgh roaster. What's inside?",
    art: <JarLabel jar={jar} />,
  })
}
