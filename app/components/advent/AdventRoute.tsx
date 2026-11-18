'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import OrderPicker from '@/app/components/advent/OrderPicker'
import SealedStop from '@/app/components/advent/SealedStop'
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
  const [justRevealed, setJustRevealed] = useState<number | null>(null)
  useEffect(() => setOpen(Math.max(daysOpen(new Date()), 1)), [])
  const stops = jarsInOrder(order).map(stop => ({ ...stop, hidden: stop.step > open && !revealed.has(stop.entry.day) }))
  const reveal = (jar: number) => {
    setRevealed(prev => new Set(prev).add(jar))
    setJustRevealed(jar)
  }
  const changeOrder = (next: typeof order) => {
    setJustRevealed(null)
    setOrder(next)
  }
  return { order, changeOrder, stops, today: stops[open - 1], reveal, justRevealed, showJar: order.id !== ORDERS[0].id }
}

type TOpenStopProps = { step: number; entry: AdventDay; showJar: boolean; stamped: boolean }

const OpenStop = ({ step, entry, showJar, stamped }: TOpenStopProps) => (
  <Link
    href={`/advent/${entry.day}`}
    className={`group flex overflow-hidden ${stamped ? 'animate-rise motion-reduce:animate-none' : ''} rounded-xl border-2 border-gray-950 bg-white shadow-[3px_3px_0_#030712] transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#030712] active:translate-y-0 active:shadow-[2px_2px_0_#030712] motion-reduce:transform-none`}
  >
    <span
      className={`flex w-16 shrink-0 flex-col items-center justify-center border-r-2 border-gray-950 bg-yellow-300 py-2 leading-none ${
        stamped ? 'animate-stamp motion-reduce:animate-none' : ''
      }`}
    >
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-900">Dec</span>
      <span className="font-serif text-3xl text-gray-950">{step}</span>
    </span>
    <div className="flex min-w-0 flex-1 items-center justify-between gap-4 px-4 py-2.5">
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900">{entry.roasterName}</p>
        <p className="truncate font-serif text-lg leading-tight text-gray-950">{entry.coffee}</p>
      </div>
      {showJar && (
        <span className="shrink-0 rounded-md border-2 border-gray-950 px-1.5 py-0.5 font-mono text-[11px] font-bold text-gray-950">
          Jar {pad(entry.day)}
        </span>
      )}
    </div>
  </Link>
)

type TStopProps = { step: number; entry: AdventDay; hidden: boolean; isToday: boolean; showJar: boolean; stamped: boolean; onReveal: () => void }

const Stop = ({ step, entry, hidden, isToday, showJar, stamped, onReveal }: TStopProps) => {
  if (isToday) return <TodayCard entry={entry} step={step} showJar={showJar} />
  if (hidden) return <SealedStop step={step} onReveal={onReveal} />
  return <OpenStop step={step} entry={entry} showJar={showJar} stamped={stamped} />
}

export default function AdventRoute() {
  const { order, changeOrder, stops, today, reveal, justRevealed, showJar } = useRoute()

  return (
    <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        <OrderPicker order={order} onChange={changeOrder} />
        <ol key={order.id} className="mt-10">
          {stops.map(({ step, entry, hidden }) => (
            <li
              key={entry.day}
              style={{ animationDelay: `${Math.min(step, 12) * 18}ms` }}
              className="relative min-h-12 animate-rise pb-6 last:pb-0 motion-reduce:animate-none"
            >
              <Stop step={step} entry={entry} hidden={hidden} isToday={step === today?.step} showJar={showJar} stamped={entry.day === justRevealed} onReveal={() => reveal(entry.day)} />
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
