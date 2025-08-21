'use client'

import { useEffect, useState } from 'react'
import { fmtYMD, parseYMDLocal } from '@/app/utils/utils'
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

const DayHeader = ({ date }: { date: string }) => (
  <div className="sticky top-0 isolate -mx-4 px-4 py-2 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60">
    <p className="text-xs font-semibold tracking-wide text-gray-500">Posted {fmtYMD(date)}</p>
  </div>
)


const foo = async () => {
  const response = await fetch('/api/updates')
  return await response.json()
}

export const News = () => {
  const [ updates, setUpdates ] = useState([])

  useEffect(() => {
    foo().then(setUpdates)
  }, [])

  // ensure newest first
  const items = [...updates].sort((a, b) => parseYMDLocal(b.post_date).getTime() - parseYMDLocal(a.post_date).getTime())

  // group by day
  const groups = items.reduce<Record<string, typeof items>>((acc, it) => {
    ;(acc[it.post_date] ||= []).push(it)
    return acc
  }, {})

  return (
    <div className="px-4 py-3 leading-relaxed">
      {Object.entries(groups).map(([day, entries]) => (
        <section key={day} className="mb-4">
          <DayHeader date={day} />
          <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white">
            {entries.map((entry, i) => (
              <li key={i} className="p-3">
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
                  {entry.tags?.map(t => <TagBadge key={t} label={t} />)}
                </div>

                {entry.description && <p className="mt-2 text-sm text-gray-700">{entry.description}</p>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
