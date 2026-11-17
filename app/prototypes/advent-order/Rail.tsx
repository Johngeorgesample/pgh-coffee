'use client'

import Link from 'next/link'
import AdventHero from './AdventHero'
import { TODAY } from './Spoiler'
import { JarTag, Locked, NoteChips, OrderHeading, StepDot, rise, useRoute } from './route-parts'
import { ADVENT_LINEUP, AdventDay } from '@/data/advent'

const roasters = Array.from(
  new Map(ADVENT_LINEUP.filter(e => e.roasterSlug).map(e => [e.roasterSlug!, e.roasterName])),
  ([slug, name]) => ({ slug, name })
).sort((a, b) => a.name.localeCompare(b.name))

const TodayCard = ({ step, entry }: { step: number; entry: AdventDay }) => (
  <a href={`/advent/${entry.day}`} className="block rounded-2xl bg-gray-950 p-6 text-white transition-colors hover:bg-gray-900">
    <p className="text-xs font-bold uppercase tracking-wider text-yellow-300">Today · Day {step}</p>
    <p className="mt-4 text-xs font-bold uppercase tracking-wider text-white/60">{entry.roasterName}</p>
    <p className="mt-1 font-serif text-2xl leading-tight tracking-tight">{entry.coffee}</p>
    {entry.origin && <p className="mt-1 text-sm text-white/60">{entry.origin}</p>}
    <div className="mt-4"><NoteChips entry={entry} /></div>
  </a>
)

const WhosInTheBox = () => (
  <div className="rounded-2xl border border-stone-200 p-6">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Who&rsquo;s in the box</h3>
    <ul className="mt-4 flex flex-wrap gap-2">
      {roasters.map(({ slug, name }) => (
        <li key={slug}>
          <Link
            href={`/roasters/${slug}`}
            className="inline-flex rounded-full border border-gray-200 bg-neutral-50 px-3 py-1 text-sm text-slate-700 transition-colors hover:border-stone-400 hover:bg-white"
          >
            {name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

export default function Rail() {
  const { order, setOrder, stops, reveal, showJar } = useRoute()
  const today = stops[TODAY - 1]

  return (
    <>
      <AdventHero />
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <OrderHeading order={order} onChange={setOrder} />
          <ol key={order.id} className="relative ml-3.5 mt-10 border-l border-stone-200 pl-8">
            {stops.map(({ step, entry, hidden }) => (
              <li key={entry.day} style={rise(step)} className="proto-rise relative min-h-12 pb-6 last:pb-0">
                <StepDot step={step} className="absolute -left-[45px] top-0" />
                {hidden ? (
                  <Locked step={step} onReveal={() => reveal(entry.day)} />
                ) : (
                  <a href={`/advent/${entry.day}`} className="group flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-800">{entry.roasterName}</p>
                      <p className="mt-1 font-serif text-xl leading-tight tracking-tight text-slate-900 group-hover:underline">{entry.coffee}</p>
                    </div>
                    {showJar && <JarTag jar={entry.day} />}
                  </a>
                )}
              </li>
            ))}
          </ol>
        </div>
        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <TodayCard step={today.step} entry={today.entry} />
          <WhosInTheBox />
        </aside>
      </section>
    </>
  )
}
