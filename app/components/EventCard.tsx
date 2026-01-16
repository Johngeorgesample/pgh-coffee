'use client'

import { MapPinIcon } from '@heroicons/react/24/outline'
import { usePlausible } from 'next-plausible'
import { isPast } from '@/app/utils/utils'
import usePanelStore from '@/stores/panelStore'
import { EventDetails } from './EventDetails'

const formatDateParts = (dateStr: string) => {
  const date = new Date(dateStr)
  return {
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: date.getDate(),
  }
}

const NewBadge = () => (
  <span className="inline-flex items-center rounded-full bg-yellow-400/30 px-1.5 py-0.5 text-[10px] font-bold text-yellow-700">
    NEW
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
  hideShopInfo?: boolean
}

export const EventCard = ({
  entry,
  hideShopInfo = false,
}: EventCardProps) => {
  const plausible = usePlausible()
  const { setPanelContent } = usePanelStore()
  const eventIsPast = entry.event_date ? isPast(entry.event_date) : false

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

  const dateParts = entry.event_date ? formatDateParts(entry.event_date) : null
  const postDate = entry.post_date || entry.postDate

  return (
    <button
      onClick={handleCardClick}
      className={`
        group flex w-full bg-white rounded-xl border border-stone-200
        overflow-hidden shadow-sm hover:shadow-md transition-all
        cursor-pointer text-left
        ${eventIsPast ? 'opacity-50' : ''}
      `}
    >
      {dateParts && (
        <div className={`w-14 flex flex-col items-center justify-center py-4 shrink-0 ${eventIsPast ? 'bg-stone-300' : 'bg-yellow-300'}`}>
          <span className="text-[10px] font-bold text-stone-600 leading-none">
            {dateParts.month}
          </span>
          <span className="text-2xl font-black text-stone-900 leading-tight">
            {dateParts.day}
          </span>
        </div>
      )}

      <div className="flex-1 p-4 relative">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-base leading-tight text-slate-900">
            {entry.title}
          </h3>
          {postDate && isNew(postDate) && <NewBadge />}
        </div>

        {!hideShopInfo && entry.shop && (
          <div className="flex items-center text-xs text-slate-500 mb-2">
            <MapPinIcon className="h-[14px] w-[14px] mr-1" />
            <span className="font-medium text-slate-700">{entry.shop.name}</span>
            <span className="mx-1">•</span>
            <span>{entry.shop.neighborhood}</span>
          </div>
        )}

        {entry.roaster && (
          <div className="flex items-center text-xs text-slate-500 mb-2">
            <span className="font-medium text-slate-700">{entry.roaster.name}</span>
          </div>
        )}

        {entry.description && (
          <p className="text-sm text-slate-600 line-clamp-1">
            {entry.description}
          </p>
        )}
      </div>
    </button>
  )
}
