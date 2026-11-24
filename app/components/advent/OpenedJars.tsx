'use client'

import SectionHead from '@/app/components/advent/SectionHead'
import Tag from '@/app/components/advent/opened-jars/Tag'
import Waiting from '@/app/components/advent/opened-jars/Waiting'
import { AdventDay } from '@/data/advent'

type Stop = { step: number; entry: AdventDay; href: string; missed: boolean }

const CatchUpNote = ({ count }: { count: number }) => (
  <p className="mt-3 text-sm text-gray-700">
    {count} from before you started {count === 1 ? 'is' : 'are'} still sealed. Open {count === 1 ? 'it' : 'them'} whenever.
  </p>
)

export default function OpenedJars({ stops }: { stops: Stop[] }) {
  const missed = stops.filter(stop => stop.missed).length
  return (
    <section className="mt-12">
      <SectionHead title="Opened" count={stops.length - missed} />
      {missed > 0 && <CatchUpNote count={missed} />}
      <ul className="mt-8 grid grid-cols-1 gap-x-5 gap-y-8 min-[440px]:grid-cols-2 sm:grid-cols-3">
        {stops.map(({ step, entry, href, missed }, i) => (
          <li key={entry.day} data-reveal style={{ animationDelay: `${(i % 3) * 40}ms` }} className="animate-rise motion-reduce:animate-none">
            {missed ? (
              <Waiting step={step} entry={entry} href={href} />
            ) : (
              <Tag step={step} entry={entry} href={href} tilt={i % 2 ? 'rotate-[1.5deg]' : '-rotate-[1.5deg]'} />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
