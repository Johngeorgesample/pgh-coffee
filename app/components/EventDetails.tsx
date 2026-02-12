'use client'

import { Calendar, SquareArrowOutUpRight, MapPin, Share2 } from 'lucide-react'
import { usePlausible } from 'next-plausible'
import { useCopyToClipboard } from '@/hooks'
import { isPast } from '@/app/utils/utils'
import { EventCardData } from './EventCard'
import CopyLinkToast from './CopyLinkToast'

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
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${cls}`}>
      {label}
    </span>
  )
}

const formatEventDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

interface EventDetailsProps {
  event: EventCardData
}

export const EventDetails = ({ event }: EventDetailsProps) => {
  const plausible = usePlausible()
  const { showToast, copyCurrentUrl, closeToast } = useCopyToClipboard()
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

  const handleExternalLink = () => {
    if (!event.url) return

    plausible('EventDetailsExternalClick', {
      props: {
        eventTitle: event.title,
        eventId: event.id,
        url: event.url,
      },
    })
  }

  return (
    <div className={`flex mt-24 lg:mt-16 h-full flex-col ${eventIsPast ? 'opacity-60' : ''}`}>
      {/* Scrollable Content */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Title Section with yellow accent bar */}
        <div className="flex">
          <div className="p-6 flex-1">
            <h1 className="font-display text-[28px] font-bold tracking-tight text-slate-900 mb-3 leading-tight">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Details Section */}
        <div className="px-6 space-y-6">
          {/* Date and Time row */}
          {event.event_date && (
            <div className="flex gap-6">
              {/* Date */}
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 p-2.5 rounded-lg">
                  <Calendar className="w-4 h-4 text-yellow-500" />
                </div>
                <div>
                  <span className="block text-[10px] font-semibold text-yellow-500 uppercase tracking-wider mb-1">
                    Date
                  </span>
                  <span className="text-slate-900 font-medium text-[15px]">
                    {formatEventDate(event.event_date)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Location */}
          {event.shop && (
            <div className="flex items-start gap-3">
              <div className="bg-yellow-100 p-2.5 rounded-lg">
                <MapPin className="w-4 h-4 text-yellow-500" />
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-yellow-500 uppercase tracking-wider mb-1">
                  Location
                </span>
                <button
                  onClick={handleShopClick}
                  className="text-left hover:opacity-80 transition-opacity"
                >
                  <div className="text-slate-900 font-bold text-[15px]">
                    {event.shop.name}
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {event.shop.neighborhood}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Roaster */}
          {event.roaster && (
            <div className="flex items-start gap-3">
              <div className="bg-yellow-100 p-2.5 rounded-lg">
                <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                </svg>
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-yellow-500 uppercase tracking-wider mb-1">
                  Roaster
                </span>
                <button
                  onClick={handleRoasterClick}
                  className="text-left hover:opacity-80 transition-opacity"
                >
                  <div className="text-slate-900 font-bold text-[15px]">
                    {event.roaster.name}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-200 pt-6">
            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
              About the Event
            </span>
            {event.description && (
              <p className="text-gray-600 leading-relaxed">
                {event.description}
              </p>
            )}
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {event.tags.map(t => (
                <TagBadge key={t} label={t} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Section */}
      <div className="shrink-0 px-6 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] bg-neutral-50 border-t border-gray-100">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {event.url && (
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleExternalLink}
                className="flex-1 bg-yellow-400 text-slate-900 font-bold py-4 rounded-full shadow-sm hover:shadow-md hover:bg-yellow-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 no-underline"
              >
                View Event Website
                <SquareArrowOutUpRight className="w-5 h-5" />
              </a>
            )}
            <button
              onClick={copyCurrentUrl}
              className="bg-white text-slate-900 font-bold py-4 px-5 rounded-full shadow-sm hover:shadow-md hover:bg-stone-50 active:scale-[0.98] transition-all border border-stone-200"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <p className="text-[11px] text-center text-gray-400 italic">
            Information is provided by the organizer and may change.
          </p>
        </div>
      </div>

      <CopyLinkToast isOpen={showToast} onClose={closeToast} />
    </div>
  )
}
