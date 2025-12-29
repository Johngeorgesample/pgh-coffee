'use client'

import { ArrowTopRightOnSquareIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline'
import { fmtYMD } from '@/app/utils/utils'

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

export type NewsCardData = {
  title: string
  description?: string
  url?: string
  tags?: string[]
  post_date: string
  event_date?: string
}

interface NewsCardProps {
  entry: NewsCardData
  asLink?: boolean
}

export const NewsCard = ({ entry, asLink = false }: NewsCardProps) => {
  const cardContent = (
    <div
      className="
        relative overflow-hidden rounded-xl border border-stone-200 bg-white
        shadow-sm transition-all duration-200 hover:border-stone-300 hover:shadow-md
      "
    >
      {/* Accent bar */}
      <div
        className="absolute bottom-0 left-0 top-0 w-1"
        style={{ backgroundColor: 'lab(89.7033 -0.480294 84.4917)' }}
      />

      <div className="p-4 pl-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold leading-tight text-stone-900">
            {entry.title}
          </h3>
          {entry.url && !asLink && (
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
          {asLink && (
            <ArrowTopRightOnSquareIcon className="h-4 w-4 shrink-0 text-stone-400 transition-colors group-hover:text-stone-600" />
          )}
        </div>

        {/* Tags and event date */}
        {(entry.event_date || (entry.tags && entry.tags.length > 0)) && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {entry.event_date && <EventDatePill date={entry.event_date} />}
            {entry.tags?.map(t => (
              <TagBadge key={t} label={t} />
            ))}
          </div>
        )}

        {/* Description */}
        {entry.description && (
          <p className="mt-2 text-sm leading-relaxed text-stone-600 line-clamp-2">
            {entry.description}
          </p>
        )}
      </div>
    </div>
  )

  if (asLink && entry.url) {
    return (
      <a
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        {cardContent}
      </a>
    )
  }

  return cardContent
}
