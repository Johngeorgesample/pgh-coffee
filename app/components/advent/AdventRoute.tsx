'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import OrderPicker from '@/app/components/advent/OrderPicker'
import PeekButton from '@/app/components/advent/PeekButton'
import { daysOpen } from '@/app/utils/advent'
import { ADVENT_LINEUP, AdventDay } from '@/data/advent'
import { ORDERS, jarsInOrder } from '@/data/advent-orders'

const roasters = Array.from(
  new Map(ADVENT_LINEUP.filter(e => e.roasterSlug).map(e => [e.roasterSlug!, e.roasterName])),
  ([slug, name]) => ({ slug, name })
).sort((a, b) => a.name.localeCompare(b.name))

const pad = (n: number) => String(n).padStart(2, '0')

const useRoute = () => {
  const [order, setOrder] = useState(ORDERS[0])
  const [open, setOpen] = useState(0)
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  useEffect(() => setOpen(daysOpen(new Date())), [])
  const stops = jarsInOrder(order).map(stop => ({ ...stop, hidden: stop.step > open && !revealed.has(stop.entry.day) }))
  const reveal = (jar: number) => setRevealed(prev => new Set(prev).add(jar))
  return { order, setOrder, stops, today: stops[open - 1], reveal, showJar: order.id !== ORDERS[0].id }
}

const NoteChips = ({ entry }: { entry: AdventDay }) =>
  entry.notes.length ? (
    <ul className="flex flex-wrap gap-1.5">
      {entry.notes.map(note => (
        <li key={note} className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
          {note}
        </li>
      ))}
    </ul>
  ) : null

const OpenStop = ({ entry, showJar }: { entry: AdventDay; showJar: boolean }) => (
  <Link href={`/advent/${entry.day}`} className="group flex items-start justify-between gap-4">
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-amber-800">{entry.roasterName}</p>
      <p className="mt-1 font-serif text-xl leading-tight tracking-tight text-slate-900 group-hover:underline">{entry.coffee}</p>
    </div>
    {showJar && (
      <span className="shrink-0 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1 font-mono text-xs text-slate-600">
        Jar {pad(entry.day)}
      </span>
    )}
  </Link>
)

const LockedStop = ({ step, onReveal }: { step: number; onReveal: () => void }) => (
  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
    <p className="flex items-center gap-1.5 text-sm font-medium text-stone-400">
      <Lock className="size-3.5" />
      Opens Dec {step}
    </p>
    <PeekButton step={step} onReveal={onReveal} />
  </div>
)

const TodayCard = ({ step, entry }: { step: number; entry: AdventDay }) => (
  <Link href={`/advent/${entry.day}`} className="block rounded-2xl bg-gray-950 p-6 text-white transition-colors hover:bg-gray-900">
    <p className="text-xs font-bold uppercase tracking-wider text-yellow-300">Today · Day {step}</p>
    <p className="mt-4 text-xs font-bold uppercase tracking-wider text-white/60">{entry.roasterName}</p>
    <p className="mt-1 font-serif text-2xl leading-tight tracking-tight">{entry.coffee}</p>
    {entry.origin && <p className="mt-1 text-sm text-white/60">{entry.origin}</p>}
    <div className="mt-4">
      <NoteChips entry={entry} />
    </div>
  </Link>
)

const WhosInTheBox = () => (
  <div className="rounded-2xl border border-stone-200 p-6">
    <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Who&rsquo;s in the box</h2>
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

export default function AdventRoute() {
  const { order, setOrder, stops, today, reveal, showJar } = useRoute()

  return (
    <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        <OrderPicker order={order} onChange={setOrder} />
        <ol key={order.id} className="relative ml-3.5 mt-10 border-l border-stone-200 pl-8">
          {stops.map(({ step, entry, hidden }) => (
            <li
              key={entry.day}
              style={{ animationDelay: `${Math.min(step, 12) * 18}ms` }}
              className="relative min-h-12 animate-rise pb-6 last:pb-0 motion-reduce:animate-none"
            >
              <span className="absolute -left-[45px] top-0 flex size-7 items-center justify-center rounded-full bg-gray-950 text-xs font-bold text-white ring-4 ring-white">
                {step}
              </span>
              {hidden ? <LockedStop step={step} onReveal={() => reveal(entry.day)} /> : <OpenStop entry={entry} showJar={showJar} />}
            </li>
          ))}
        </ol>
      </div>
      <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
        {today && <TodayCard step={today.step} entry={today.entry} />}
        <WhosInTheBox />
      </aside>
    </section>
  )
}
