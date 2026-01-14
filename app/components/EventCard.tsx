'use client'

import { useState } from 'react'
import { ArrowTopRightOnSquareIcon, CalendarIcon, ClockIcon, MapPinIcon, TagIcon } from '@heroicons/react/24/outline'
import { usePlausible } from 'next-plausible'
import { fmtYMD, isPast } from '@/app/utils/utils'
import usePanelStore from '@/stores/panelStore'
import { EventDetails } from './EventDetails'

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

export type EventCardData = {
  id: string
  title: string
  description?: string | null
  url?: string | null
  tags?: string[] | null
  post_date?: string
  postDate?: string
  event_date?: string | null
  shop?: {
    name: string
    neighborhood: string
  }
  roaster?: {
    name: string
    slug: string
  }
}

interface EventCardProps {
  entry: EventCardData
  asLink?: boolean
  showDescription?: boolean
  showTime?: boolean
  showNewPill?: boolean
  hideShopInfo?: boolean
}

export const EventCard = ({
  entry,
  asLink = false,
  showDescription = true,
  showTime = false,
  showNewPill = true,
  hideShopInfo = false,
}: EventCardProps) => {
  const [expanded, setExpanded] = useState(false)
  const plausible = usePlausible()
  const { setPanelContent } = usePanelStore()
  const eventIsPast = entry.event_date ? isPast(entry.event_date) : false
  const shouldTruncate = entry.description && entry.description.length > 120
  const postDate = entry.post_date || entry.postDate

  const handleCardClick = () => {
    plausible('EventCardClick', {
      props: {
        eventTitle: entry.title,
        eventId: entry.id,
        shopName: entry.shop?.name,
        neighborhood: entry.shop?.neighborhood,
        roasterName: entry.roaster?.name,
        roasterSlug: entry.roaster?.slug,
      },
    })

    // Update URL
    const url = new URL(window.location.href)
    url.searchParams.set('event', entry.id)
    url.searchParams.delete('shop')
    url.searchParams.delete('company')
    url.searchParams.delete('roaster')
    window.history.pushState(null, '', url.toString())

    // Open event details panel
    setPanelContent(<EventDetails event={entry} />, 'event')
  }

  const cardContent = (
    <button
      onClick={handleCardClick}
      className={`
        relative overflow-hidden rounded-xl border border-stone-200 bg-white
        shadow-sm transition-all duration-200 hover:border-stone-300 hover:shadow-md
        cursor-pointer text-left
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
            {showNewPill && postDate && isNew(postDate) && <NewPill />}
          </h3>
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
              {showTime && (
                <>
                  <ClockIcon className="h-3.5 w-3.5" />
                  <span className={eventIsPast ? '' : 'font-semibold'}>
                    {/* @TODO get time for event */}
                    time
                  </span>
                </>
              )}
            </span>
          </div>
        )}

        {/* Shop info */}
        {!hideShopInfo && entry.shop && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500">
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="h-3.5 w-3.5" />
              <span
                className={eventIsPast ? '' : 'font-semibold'}
                style={eventIsPast ? {} : { color: 'lab(45 10 50)' }}
              >
                {entry.shop.name}
              </span>
              •<span>{entry.shop.neighborhood}</span>
            </span>
          </div>
        )}

        {/* Roaster info */}
        {entry.roaster && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500">
            <span className={eventIsPast ? '' : 'font-semibold'} style={eventIsPast ? {} : { color: 'lab(45 10 50)' }}>
              {entry.roaster.name}
            </span>
          </div>
        )}

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {entry.tags.map(t => (
              <TagBadge key={t} label={t} />
            ))}
          </div>
        )}

        {/* Description */}
        {showDescription && entry.description && (
          <>
            <p className={`mt-3 text-sm leading-relaxed text-stone-600 ${expanded ? '' : 'line-clamp-2'}`}>
              {entry.description}
            </p>
            {shouldTruncate && !asLink && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setExpanded(!expanded)
                }}
                className="mt-1.5 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: 'lab(45 10 50)' }}
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </>
        )}
      </div>
    </button>
  )

  return cardContent
}
