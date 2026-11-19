'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import BeforeOpening from '@/app/components/advent/BeforeOpening'
import ChooseOrder from '@/app/components/advent/ChooseOrder'
import DevPanel from '@/app/components/advent/DevPanel'
import { readVisited } from '@/app/components/advent/MarkVisited'
import OpenedJars from '@/app/components/advent/OpenedJars'
import SealedJars from '@/app/components/advent/SealedJars'
import TodayCard from '@/app/components/advent/TodayCard'
import SectionHead from '@/app/components/advent/SectionHead'
import WhosInTheBox from '@/app/components/advent/WhosInTheBox'
import { daysOpen, daysUntilOpening, devDayDate } from '@/app/utils/advent'
import { storageGet, storageSet } from '@/app/utils/storage'
import { ORDERS, Order, findOrder, jarHref, jarsInOrder } from '@/data/advent-orders'

const DEV_TOOLS = process.env.NETLIFY_CONTEXT !== 'production'

const currentDate = () => (DEV_TOOLS && devDayDate(window.location.search)) || new Date()

const ORDER_KEY = 'advent:order'
const STARTED_KEY = 'advent:started'

const storedOrder = () => {
  const id = storageGet(ORDER_KEY)
  return id ? findOrder(id) : null
}

const storedStart = () => Number(storageGet(STARTED_KEY)) || 1

const useOrder = () => {
  const [order, setOrder] = useState<Order | null>(null)
  const [started, setStarted] = useState(1)
  const [visited, setVisited] = useState<number[]>([])
  useEffect(() => {
    setOrder(storedOrder())
    setStarted(storedStart())
    setVisited(readVisited())
  }, [])
  const choose = (next: Order, step: number) => {
    storageSet(ORDER_KEY, next.id)
    storageSet(STARTED_KEY, String(step))
    setOrder(next)
    setStarted(step)
  }
  return { order, started, visited, choose }
}

const useRoute = () => {
  const { order, started, visited, choose } = useOrder()
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => setNow(currentDate()), [])
  const open = now ? daysOpen(now) : 0
  const stops = jarsInOrder(order ?? ORDERS[0]).map(stop => ({ ...stop, hidden: !order || stop.step > open }))
  const countdown = now && open === 0 ? daysUntilOpening(now) : null
  return { order, started, visited, choose, stops, open, today: order ? stops[open - 1] : undefined, countdown }
}

export default function AdventRoute() {
  const { order, started, visited, choose, stops, open, today, countdown } = useRoute()
  const router = useRouter()
  const jars = stops.map(({ step, entry, hidden }) => ({ step, day: entry.day, sealed: hidden }))
  const opened = stops
    .filter(stop => !stop.hidden && stop.step !== today?.step)
    .map(stop => ({ ...stop, missed: stop.step < started && !visited.includes(stop.entry.day) }))

  return (
    <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        {order && open > 0 && <h2 className="font-serif text-3xl tracking-tight text-gray-950">{order.label} order</h2>}
        <div key={order?.id}>
          {countdown !== null && <BeforeOpening days={countdown} />}
          {!order && open > 0 && <ChooseOrder step={open} onChoose={next => choose(next, open)} />}
          {today && (
            <section className="mt-10 animate-rise motion-reduce:animate-none">
              <SectionHead title="Today's coffee" />
              <div className="mt-8">
                <TodayCard entry={today.entry} step={today.step} href={today.href} />
              </div>
            </section>
          )}
          {opened.length > 0 && <OpenedJars stops={opened} />}
          {jars.some(jar => jar.sealed) && (
            <SealedJars jars={jars} locked={!order || open === 0} onReveal={day => order && router.push(jarHref(order, day))} />
          )}
        </div>
      </div>
      <aside className="flex flex-col gap-4 lg:self-start">
        <WhosInTheBox />
      </aside>
      {DEV_TOOLS && <DevPanel />}
    </section>
  )
}
