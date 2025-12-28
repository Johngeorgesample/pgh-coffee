'use client'

import { useEffect, useState } from 'react'
import { fmtYMD } from '@/app/utils/utils'
import { ArrowTopRightOnSquareIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline'

type TagKey = 'opening' | 'closure' | 'coming soon' | 'throwdown' | 'event' | 'seasonal' | 'menu'
const TAG_STYLES: Record<TagKey, string> = {
  opening: 'bg-green-100 text-green-800',
  closure: 'bg-red-100 text-red-800',
  'coming soon': 'bg-amber-100 text-amber-800',
  throwdown: 'bg-purple-100 text-purple-800',
  event: 'bg-blue-100 text-blue-800',
  seasonal: 'bg-pink-100 text-pink-800',
  menu: 'bg-slate-100 text-slate-800',
}

const TagBadge = ({ label }: { label: string }) => {
  const cls = TAG_STYLES[label as TagKey] ?? 'bg-gray-100 text-gray-800'
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${cls}`}>
      <TagIcon className="h-3 w-3" />
      {label}
    </span>
  )
}

const EventDatePill = ({ date }: { date: string }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-800 px-2 py-0.5 text-[11px]">
    <CalendarIcon className="h-3 w-3" />
    {fmtYMD(date)}
  </span>
)

const NewPill = () => (
  <span className="ml-2 inline-flex items-center rounded-full bg-yellow-400/20 px-2 py-0.5 text-xs font-medium text-yellow-500">
    New
  </span>
)

const isNew = (date: string) => {
  const created = new Date(date).getTime()
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  return created > sevenDaysAgo
}

type EventRow = {
  id: string
  title: string
  description?: string | null
  url?: string | null
  tags?: string[] | null
  post_date: string
  event_date?: string | null
}

const fetchEvents = async (): Promise<EventRow[]> => {
  const res = await fetch('/api/events', { cache: 'no-store' })
  return res.json()
}

export const Events = () => {
  const [events, setEvents] = useState<EventRow[]>([])

  useEffect(() => {
    fetchEvents().then(setEvents)
  }, [])

  return (
    <div className="mt-20 px-4 py-3 leading-relaxed">
      <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white">
        {events.map((entry) => (
          <li key={entry.id} className="p-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-gray-900">{entry.title}</h3>
              {entry.url && (
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-gray-500 hover:text-gray-700"
                  aria-label="Source"
                  title="Source"
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </a>
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              {entry.event_date && <EventDatePill date={entry.event_date} />}
              {isNew(entry.post_date) && <NewPill />}
              {entry.tags?.map((t) => <TagBadge key={t} label={t} />)}
            </div>

            {entry.description && <p className="mt-2 text-sm text-gray-700">{entry.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}
