'use client'

import { ArrowTopRightOnSquareIcon, CalendarIcon, MapPinIcon, TagIcon } from '@heroicons/react/24/outline'
import { usePlausible } from 'next-plausible'
import { fmtYMD, isPast } from '@/app/utils/utils'
import { EventCardData } from './EventCard'

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

interface EventDetailsProps {
  event: EventCardData
}

export const EventDetails = ({ event }: EventDetailsProps) => {
  const plausible = usePlausible()
  const eventIsPast = event.event_date ? isPast(event.event_date) : false

  const handleShopClick = () => {
    if (!event.shop) return

    plausible('EventDetailsShopClick', {
      props: {
        eventTitle: event.title,
        shopName: event.shop.name,
        neighborhood: event.shop.neighborhood,
      },
    })

    const shopParam = `${event.shop.name}_${event.shop.neighborhood}`
    window.location.href = `?shop=${encodeURIComponent(shopParam)}`
  }

  const handleRoasterClick = () => {
    if (!event.roaster?.slug) return

    plausible('EventDetailsRoasterClick', {
      props: {
        eventTitle: event.title,
        roasterName: event.roaster.name,
        roasterSlug: event.roaster.slug,
      },
    })

    window.location.href = `?roaster=${encodeURIComponent(event.roaster.slug)}`
  }

  return (
    <div className={`flex h-full flex-col overflow-y-auto ${eventIsPast ? 'opacity-50' : ''}`}>
      <div className="px-6 lg:px-4 mt-20 lg:mt-16 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 className="font-medium text-2xl">{event.title}</h2>
          {event.url && (
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-stone-400 transition-colors hover:text-stone-600"
              aria-label="Source"
              title="Source"
            >
              <ArrowTopRightOnSquareIcon className="h-5 w-5" />
            </a>
          )}
        </div>

        {/* Event date */}
        {event.event_date && (
          <div className="flex items-center gap-2 text-sm text-stone-600 mb-4">
            <CalendarIcon className="h-4 w-4" />
            <span
              className={eventIsPast ? '' : 'font-semibold'}
              style={eventIsPast ? {} : { color: 'lab(45 10 50)' }}
            >
              {fmtYMD(event.event_date)}
            </span>
          </div>
        )}

        {/* Shop info */}
        {event.shop && (
          <button
            onClick={handleShopClick}
            className="flex items-center gap-2 text-sm text-stone-600 mb-4 hover:text-stone-900 transition-colors text-left"
          >
            <MapPinIcon className="h-4 w-4" />
            <span
              className={eventIsPast ? '' : 'font-semibold'}
              style={eventIsPast ? {} : { color: 'lab(45 10 50)' }}
            >
              {event.shop.name}
            </span>
            <span>•</span>
            <span>{event.shop.neighborhood}</span>
          </button>
        )}

        {/* Roaster info */}
        {event.roaster && (
          <button
            onClick={handleRoasterClick}
            className="flex items-center gap-2 text-sm text-stone-600 mb-4 hover:text-stone-900 transition-colors text-left"
          >
            <span
              className={eventIsPast ? '' : 'font-semibold'}
              style={eventIsPast ? {} : { color: 'lab(45 10 50)' }}
            >
              {event.roaster.name}
            </span>
          </button>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            {event.tags.map(t => (
              <TagBadge key={t} label={t} />
            ))}
          </div>
        )}

        {/* Description */}
        {event.description && (
          <p className="text-sm leading-relaxed text-stone-600">{event.description}</p>
        )}
      </div>
    </div>
  )
}
