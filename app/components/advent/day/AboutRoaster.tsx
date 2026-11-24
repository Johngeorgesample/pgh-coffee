import { ArrowUpRight, MapPin } from 'lucide-react'
import TrackedLink from '@/app/components/advent/TrackedLink'
import { prose } from '@/app/components/advent/day/Blurb'
import Section from '@/app/components/advent/day/Section'
import { AdventDay } from '@/data/advent'
import { getRoasterBySlug } from '@/app/utils/roasters'

export type TRoaster = Awaited<ReturnType<typeof getRoasterBySlug>>

const inkButton =
  'relative inline-flex min-h-11 items-center gap-2 rounded-lg border-2 border-gray-950 bg-white px-4 text-sm font-bold text-gray-950 shadow-[3px_3px_0_#030712] transition-[transform,box-shadow,background-color] duration-150 ease-out [@media(hover:hover)_and_(pointer:fine)]:hover:bg-yellow-300 [@media(hover:hover)_and_(pointer:fine)]:hover:not-active:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:hover:not-active:shadow-[3px_5px_0_#030712] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none after:absolute after:inset-x-0 after:top-full after:h-1'

const AboutRoaster = ({ entry, roaster }: { entry: AdventDay; roaster: NonNullable<TRoaster> }) => (
  <Section title="About the roaster">
    {roaster.description && <p className={`mb-5 ${prose}`}>{roaster.description}</p>}
    <div className="flex flex-wrap gap-3">
      <TrackedLink
        href={`/roasters/${entry.roasterSlug}`}
        event="AdventRoasterClicked"
        eventProps={{ roaster: entry.roasterSlug!, from: 'dayPage' }}
        className={inkButton}
      >
        <MapPin className="size-4" strokeWidth={2.5} />
        Where to find this coffee
      </TrackedLink>
      {roaster.website && (
        <a href={roaster.website} target="_blank" rel="noopener noreferrer" className={inkButton}>
          <ArrowUpRight className="size-4" strokeWidth={2.5} />
          Website
        </a>
      )}
    </div>
  </Section>
)

export default AboutRoaster
