'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import BeforeOpening from '@/app/components/advent/BeforeOpening'
import ChooseOrder from '@/app/components/advent/ChooseOrder'
import OpenedJars from '@/app/components/advent/OpenedJars'
import SealedJars from '@/app/components/advent/SealedJars'
import TodayCard from '@/app/components/advent/TodayCard'
import SectionHead from '@/app/components/advent/SectionHead'
import WhosInTheBox from '@/app/components/advent/WhosInTheBox'
import { daysOpen, daysUntilOpening, devDayDate } from '@/app/utils/advent'
import { ORDERS, Order, findOrder, jarHref, jarsInOrder } from '@/data/advent-orders'

const currentDate = () => (process.env.NETLIFY_CONTEXT !== 'production' && devDayDate(window.location.search)) || new Date()

const ORDER_KEY = 'advent:order'
const STARTED_KEY = 'advent:started'

const storedOrder = () => {
  const id = localStorage.getItem(ORDER_KEY)
  return id ? findOrder(id) : null
}

const urlOrder = () => findOrder(new URLSearchParams(window.location.search).get('order') ?? undefined)

const syncUrl = (order: Order) => {
  const url = new URL(window.location.href)
  if (order === ORDERS[0]) url.searchParams.delete('order')
  else url.searchParams.set('order', order.id)
  window.history.replaceState(null, '', url)
}

const storedStart = () => Number(localStorage.getItem(STARTED_KEY)) || 1

const useOrder = () => {
  const [order, setOrder] = useState<Order | null>(null)
  const [started, setStarted] = useState(1)
  const [suggested, setSuggested] = useState(ORDERS[0])
  useEffect(() => {
    const stored = storedOrder()
    if (stored) syncUrl(stored)
    setOrder(stored)
    setStarted(storedStart())
    setSuggested(urlOrder())
  }, [])
  const choose = (next: Order, step: number) => {
    localStorage.setItem(ORDER_KEY, next.id)
    localStorage.setItem(STARTED_KEY, String(step))
    syncUrl(next)
    setOrder(next)
    setStarted(step)
  }
  return { order, started, suggested, choose }
}

const useRoute = () => {
  const { order, started, suggested, choose } = useOrder()
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => setNow(currentDate()), [])
  const open = now ? daysOpen(now) : 0
  const stops = jarsInOrder(order ?? ORDERS[0]).map(stop => ({ ...stop, hidden: !order || stop.step > open }))
  const countdown = now && open === 0 ? daysUntilOpening(now) : null
  return { order, started, suggested, choose, stops, open, today: order ? stops[open - 1] : undefined, countdown }
}

export default function AdventRoute() {
  const { order, started, suggested, choose, stops, open, today, countdown } = useRoute()
  const router = useRouter()
  const jars = stops.map(({ step, entry, hidden }) => ({ step, day: entry.day, sealed: hidden }))
  const past = stops.filter(stop => !stop.hidden && stop.step !== today?.step)
  const catchUp = past.filter(stop => stop.step < started)
  const opened = past.filter(stop => stop.step >= started)

  return (
    <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        {order && open > 0 && <h2 className="font-serif text-3xl tracking-tight text-gray-950">{order.label} order</h2>}
        <div key={order?.id}>
          {countdown !== null && <BeforeOpening days={countdown} />}
          {!order && open > 0 && <ChooseOrder step={open} suggested={suggested} onChoose={next => choose(next, open)} />}
          {today && (
            <section className="mt-10 animate-rise motion-reduce:animate-none">
              <SectionHead title="Today's coffee" />
              <div className="mt-8">
                <TodayCard entry={today.entry} step={today.step} href={today.href} />
              </div>
            </section>
          )}
          {catchUp.length > 0 && <OpenedJars title="Catch up" stops={catchUp} />}
          {opened.length > 0 && <OpenedJars title="Opened" stops={opened} />}
          {jars.some(jar => jar.sealed) && (
            <SealedJars jars={jars} locked={!order || open === 0} onReveal={day => order && router.push(jarHref(order, day))} />
          )}
        </div>
      </div>
      <aside className="flex flex-col gap-4 lg:self-start">
        <WhosInTheBox />
      </aside>
    </section>
  )
}
