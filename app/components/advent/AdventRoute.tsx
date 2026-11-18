'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import BeforeOpening from '@/app/components/advent/BeforeOpening'
import OpenedJars from '@/app/components/advent/OpenedJars'
import OrderPicker from '@/app/components/advent/OrderPicker'
import SealedJars from '@/app/components/advent/SealedJars'
import TodayCard from '@/app/components/advent/TodayCard'
import SectionHead from '@/app/components/advent/SectionHead'
import WhosInTheBox from '@/app/components/advent/WhosInTheBox'
import { daysOpen, daysUntilOpening, devDayDate } from '@/app/utils/advent'
import { ORDERS, jarsInOrder } from '@/data/advent-orders'

const currentDate = () => (process.env.NETLIFY_CONTEXT !== 'production' && devDayDate(window.location.search)) || new Date()

const useRoute = () => {
  const [order, setOrder] = useState(ORDERS[0])
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => setNow(currentDate()), [])
  const open = now ? daysOpen(now) : 0
  const stops = jarsInOrder(order).map(stop => ({ ...stop, hidden: stop.step > open }))
  const countdown = now && open === 0 ? daysUntilOpening(now) : null
  const locked = open === 0
  return { order, setOrder, stops, today: stops[open - 1], countdown, locked }
}

export default function AdventRoute() {
  const { order, setOrder, stops, today, countdown, locked } = useRoute()
  const router = useRouter()
  const sealed = stops.filter(stop => stop.hidden).map(({ step, entry }) => ({ step, day: entry.day }))
  const opened = stops.filter(stop => !stop.hidden && stop.step !== today?.step)

  return (
    <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        {!locked && <OrderPicker order={order} onChange={setOrder} />}
        <div key={order.id}>
          {countdown !== null && <BeforeOpening days={countdown} />}
          {today && (
            <section className="mt-10 animate-rise motion-reduce:animate-none">
              <SectionHead title="Today's coffee" />
              <div className="mt-8">
                <TodayCard entry={today.entry} step={today.step} />
              </div>
            </section>
          )}
          {opened.length > 0 && <OpenedJars stops={opened} />}
          {sealed.length > 0 && <SealedJars jars={sealed} locked={locked} onReveal={day => router.push(`/advent/${day}`)} />}
        </div>
      </div>
      <aside className="flex flex-col gap-4 lg:self-start">
        <WhosInTheBox />
      </aside>
    </section>
  )
}
