'use client'

import { useEffect, useState } from 'react'
import { fmtYMD } from '@/app/utils/utils'
import {
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon,
} from '@heroicons/react/24/outline'

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

const NewPill = () => (
  <span className="inline-flex items-center rounded-full bg-yellow-400/20 px-2 py-0.5 text-xs font-medium text-yellow-600">
    New
  </span>
)

const isNew = (date: string) => {
  const created = new Date(date).getTime()
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  return created > sevenDaysAgo
}

const isPast = (date: string) => {
  return new Date(date).getTime() < Date.now()
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

const EventCard = ({ entry }: { entry: EventRow }) => {
  const [expanded, setExpanded] = useState(false)
  const eventIsPast = entry.event_date ? isPast(entry.event_date) : false
  const shouldTruncate = entry.description && entry.description.length > 120

  return (
    <li
      className={`
        relative overflow-hidden rounded-xl border border-stone-200 bg-white
        shadow-sm transition-all duration-200 hover:border-stone-300 hover:shadow-md
        ${eventIsPast ? 'opacity-50' : ''}
      `}
    >
      {/* Yellow accent bar */}
      <div
        className="absolute bottom-0 left-0 top-0 w-1"
        style={{ backgroundColor: 'lab(89.7033 -0.480294 84.4917)' }}
      />

      <div className="p-4 pl-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold leading-tight text-stone-900">
            {entry.title}
            {isNew(entry.post_date) && <NewPill />}
          </h3>
          {entry.url && (
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-stone-400 transition-colors hover:text-stone-600"
              aria-label="Source"
              title="Source"
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </a>
          )}
        </div>

        {/* Meta info */}
        {entry.event_date && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500">
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span
                className={eventIsPast ? '' : 'font-semibold'}
                style={eventIsPast ? {} : { color: 'lab(45 10 50)' }}
              >
                {fmtYMD(entry.event_date)}
              </span>
            </span>
          </div>
        )}

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {entry.tags.map((t) => (
              <TagBadge key={t} label={t} />
            ))}
          </div>
        )}

        {/* Description */}
        {entry.description && (
          <>
            <p
              className={`mt-3 text-sm leading-relaxed text-stone-600 ${
                expanded ? '' : 'line-clamp-2'
              }`}
            >
              {entry.description}
            </p>
            {shouldTruncate && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-1.5 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: 'lab(45 10 50)' }}
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </>
        )}
      </div>
    </li>
  )
}

export const Events = () => {
  const [events, setEvents] = useState<EventRow[]>([])

  useEffect(() => {
    fetchEvents().then(setEvents)
  }, [])

  const upcomingEvents = events.filter((e) => !e.event_date || !isPast(e.event_date))
  const pastEvents = events.filter((e) => e.event_date && isPast(e.event_date))

  return (
    <div className="mt-20 px-4 py-3">
      {/* Upcoming events */}
      {upcomingEvents.length > 0 && (
        <>
          <div className="mb-3 flex items-center gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Upcoming
            </h2>
            <div className="h-px flex-1 bg-stone-200" />
          </div>

          <ul className="space-y-3">
            {upcomingEvents.map((entry) => (
              <EventCard key={entry.id} entry={entry} />
            ))}
          </ul>
        </>
      )}

      {/* Past events */}
      {pastEvents.length > 0 && (
        <>
          <div className="mb-3 mt-6 flex items-center gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Past</h2>
            <div className="h-px flex-1 bg-stone-200" />
          </div>

          <ul className="space-y-3">
            {pastEvents.map((entry) => (
              <EventCard key={entry.id} entry={entry} />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
