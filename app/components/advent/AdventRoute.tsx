'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import OrderPicker from '@/app/components/advent/OrderPicker'
import PeekButton from '@/app/components/advent/PeekButton'
import TodayCard from '@/app/components/advent/TodayCard'
import WhosInTheBox from '@/app/components/advent/WhosInTheBox'
import { daysOpen } from '@/app/utils/advent'
import { AdventDay } from '@/data/advent'
import { ORDERS, jarsInOrder } from '@/data/advent-orders'

const pad = (n: number) => String(n).padStart(2, '0')

const useRoute = () => {
  const [order, setOrder] = useState(ORDERS[0])
  const [open, setOpen] = useState(1)
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  useEffect(() => setOpen(Math.max(daysOpen(new Date()), 1)), [])
  const stops = jarsInOrder(order).map(stop => ({ ...stop, hidden: stop.step > open && !revealed.has(stop.entry.day) }))
  const reveal = (jar: number) => setRevealed(prev => new Set(prev).add(jar))
  return { order, setOrder, stops, today: stops[open - 1], reveal, showJar: order.id !== ORDERS[0].id }
}

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

type TStopProps = { step: number; entry: AdventDay; hidden: boolean; isToday: boolean; showJar: boolean; onReveal: () => void }

const Stop = ({ step, entry, hidden, isToday, showJar, onReveal }: TStopProps) => {
  if (isToday) return <TodayCard entry={entry} />
  if (hidden) return <LockedStop step={step} onReveal={onReveal} />
  return <OpenStop entry={entry} showJar={showJar} />
}

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
              <Stop step={step} entry={entry} hidden={hidden} isToday={step === today?.step} showJar={showJar} onReveal={() => reveal(entry.day)} />
            </li>
          ))}
        </ol>
      </div>
      <aside className="flex flex-col gap-4 lg:self-start">
        <WhosInTheBox />
      </aside>
    </section>
  )
}
