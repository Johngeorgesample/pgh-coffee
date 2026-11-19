import { ADVENT_OG_CARD, renderAdventOg } from '@/app/utils/adventOg'
import { OG_CONTENT_TYPE, OG_IMAGE_SIZE, readPublicImageAsDataUri } from '@/app/utils/ogTheme'

export const size = OG_IMAGE_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Pittsburgh Coffee Advent Calendar 2026: twenty-five days of Pittsburgh coffee'

const Lid = () => (
  <div style={{ ...ADVENT_OG_CARD, display: 'flex', borderRadius: 24, overflow: 'hidden', transform: 'rotate(3deg)' }}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={readPublicImageAsDataUri('advent/og/lid.jpg')} width={420} height={420} alt="" />
  </div>
)

export default function Image() {
  return renderAdventOg({
    headline: 'Twenty-five days of Pittsburgh coffee.',
    subline: 'One jar a day, December 1st through Christmas.',
    art: <Lid />,
  })
}
