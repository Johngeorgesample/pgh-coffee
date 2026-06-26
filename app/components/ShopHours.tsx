'use client'

import { useEffect, useMemo, useState } from 'react'
import { ClockIcon } from '@heroicons/react/24/outline'
import { TShop } from '@/types/shop-types'
import { HoursRow, formatTime, isOpenNow, pittsburghNow } from '@/lib/hours'
import ShopHoursSkeleton from './ShopHoursSkeleton'

interface IProps {
  shop: TShop
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

// One day's label, e.g. "7 AM – 6 PM", or split "7 AM – 2 PM, 5 PM – 9 PM".
const formatDayRanges = (rows: HoursRow[]): string =>
  rows.map(r => `${formatTime(r.opens_at)} – ${formatTime(r.closes_at)}`).join(', ')

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
