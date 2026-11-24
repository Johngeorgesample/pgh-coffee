import BrewVideo from '@/app/components/advent/BrewVideo'
import MarkVisited from '@/app/components/advent/MarkVisited'
import TastingJournal from '@/app/components/advent/TastingJournal'
import AboutRoaster, { TRoaster } from '@/app/components/advent/day/AboutRoaster'
import Blurb from '@/app/components/advent/day/Blurb'
import Section from '@/app/components/advent/day/Section'
import { AdventDay } from '@/data/advent'
import { Order, jarHref } from '@/data/advent-orders'

const Reading = ({
  entry,
  order,
  step,
  roaster,
}: {
  entry: AdventDay
  order: Order
  step: number
  roaster: TRoaster
}) => (
  <div className="flex flex-col gap-14 lg:pt-6">
    <MarkVisited jar={entry.day} order={order.id} step={step} />
    {entry.blurb && (
      <Section title="In the cup">
        <Blurb text={entry.blurb} />
      </Section>
    )}
    <Section title="Watch the roaster brew it">
      <BrewVideo videoId={entry.videoId} roasterName={entry.roasterName} jar={entry.day} />
    </Section>
    <Section title="My tasting journal">
      <TastingJournal day={entry.day} step={step} notes={entry.notes} returnTo={jarHref(order, entry.day)} />
    </Section>
    {roaster && <AboutRoaster entry={entry} roaster={roaster} />}
  </div>
)

export default Reading
