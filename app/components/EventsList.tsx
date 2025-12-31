'use client'

import { EventCard, EventCardData } from './EventCard'

interface EventsListProps {
  events: EventCardData[]
  title?: string
  asLink?: boolean
  showDescription?: boolean
  showTime?: boolean
  showNewPill?: boolean
  hideShopInfo?: boolean
  emptyMessage?: string
}

export const EventsList = ({
  events,
  title,
  asLink = false,
  showDescription = true,
  showTime = false,
  showNewPill = true,
  hideShopInfo = false,
  emptyMessage = 'No events to display',
}: EventsListProps) => {
  if (events.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-stone-500">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div>
      {title && (
        <div className="mb-3 flex items-center gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {title}
          </h2>
          <div className="h-px flex-1 bg-stone-200" />
        </div>
      )}

      <ul className="space-y-3">
        {events.map(entry => (
          <EventCard
            key={entry.id}
            entry={entry}
            asLink={asLink}
            showDescription={showDescription}
            showTime={showTime}
            showNewPill={showNewPill}
            hideShopInfo={hideShopInfo}
          />
        ))}
      </ul>
    </div>
  )
}
