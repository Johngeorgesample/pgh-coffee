'use client'

import { useEffect, useMemo, useState } from 'react'
import { ClockIcon } from '@heroicons/react/24/outline'
import { TShop } from '@/types/shop-types'
import ShopHoursSkeleton from './ShopHoursSkeleton'

interface IProps {
  shop: TShop
}

// One schedule row as stored in shop_hours. Times arrive as 'HH:MM:SS'.
interface HoursRow {
  day_of_week: number // 0=Sun .. 6=Sat
  opens_at: string
  closes_at: string
  spans_midnight: boolean
}

// Display order is Monday-first; the data is 0=Sun..6=Sat.
const DISPLAY_DAYS: { dow: number; label: string }[] = [
  { dow: 1, label: 'Mon' },
  { dow: 2, label: 'Tue' },
  { dow: 3, label: 'Wed' },
  { dow: 4, label: 'Thu' },
  { dow: 5, label: 'Fri' },
  { dow: 6, label: 'Sat' },
  { dow: 0, label: 'Sun' },
]

const toMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

// '07:00:00' -> '7 AM', '06:30:00' -> '6:30 AM', '00:00:00' -> '12 AM'
const formatTime = (time: string): string => {
  const [h, m] = time.split(':').map(Number)
  const period = h < 12 ? 'AM' : 'PM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${hour12} ${period}` : `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

// One day's label, e.g. "7 AM – 6 PM", or split "7 AM – 2 PM, 5 PM – 9 PM".
const formatDayRanges = (rows: HoursRow[]): string =>
  rows.map(r => `${formatTime(r.opens_at)} – ${formatTime(r.closes_at)}`).join(', ')

// Pittsburgh-local "now", so open-now and the highlighted row stay correct no
// matter the viewer's timezone (stored times are America/New_York wall-clock).
const pittsburghNow = (): { day: number; minutes: number } => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? ''
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return { day: dayMap[get('weekday')], minutes: Number(get('hour')) * 60 + Number(get('minute')) }
}

const isOpenNow = (rows: HoursRow[], now: { day: number; minutes: number }): boolean => {
  const prevDay = (now.day + 6) % 7
  return rows.some(r => {
    const opens = toMinutes(r.opens_at)
    const closes = toMinutes(r.closes_at)
    if (r.spans_midnight) {
      // Opens on its day and runs past midnight: open [opens, 24:00) on the row's
      // day, then [00:00, closes) the next day. A 00:00 close makes the next-day
      // slice empty, so 1 AM correctly reads as closed.
      if (r.day_of_week === now.day && now.minutes >= opens) return true
      if (r.day_of_week === prevDay && now.minutes < closes) return true
      return false
    }
    return r.day_of_week === now.day && now.minutes >= opens && now.minutes < closes
  })
}

export default function ShopHours({ shop }: IProps) {
  const [rows, setRows] = useState<HoursRow[] | null>(null)
  const shopId = shop.properties.uuid

  // Snapshot Pittsburgh time per shop. ShopHours re-renders (not remounts) when
  // switching shops, so keying this to shopId refreshes "now" on each selection.
  const now = useMemo(() => pittsburghNow(), [shopId])

  useEffect(() => {
    // Clear the previous shop's rows so the section renders null (not stale
    // hours/badge) while the new shop's fetch is in flight — ShopHours
    // reconciles across shop selections rather than remounting.
    setRows(null)
    if (!shopId) {
      setRows([])
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/shops/hours/${shopId}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: HoursRow[] = await res.json()
        if (!cancelled) setRows(data)
      } catch {
        if (!cancelled) setRows([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [shopId])

  const byDay = useMemo(() => {
    const map = new Map<number, HoursRow[]>()
    for (const r of rows ?? []) {
      const list = map.get(r.day_of_week) ?? []
      list.push(r)
      map.set(r.day_of_week, list)
    }
    return map
  }, [rows])

  if (rows === null) return <ShopHoursSkeleton />

  // No schedule on file: render nothing rather than an empty section.
  if (rows.length === 0) return null

  const open = isOpenNow(rows, now)

  return (
    <section className="border-b border-stone-200 px-4 py-5 sm:px-6">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Hours</p>
        <span
          className={`flex items-center gap-1.5 text-sm font-semibold ${
            open ? 'text-green-600' : 'text-gray-400'
          }`}
        >
          <ClockIcon className="h-4 w-4" />
          {open ? 'Open now' : 'Closed'}
        </span>
      </div>

      <ul className="text-[15px]">
        {DISPLAY_DAYS.map(({ dow, label }) => {
          const dayRows = byDay.get(dow)
          const isToday = dow === now.day
          return (
            <li
              key={dow}
              className={`flex items-center justify-between rounded-md px-2 py-1.5 ${
                isToday ? 'bg-amber-100 font-semibold text-gray-900' : 'text-gray-600'
              }`}
            >
              <span>{label}</span>
              <span>{dayRows ? formatDayRanges(dayRows) : 'Closed'}</span>
            </li>
          )
        })}
      </ul>

      <p className="mt-3 text-xs text-gray-400">Hours powered by Google</p>
    </section>
  )
}
