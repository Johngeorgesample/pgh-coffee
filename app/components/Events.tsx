'use client'

import { useEffect, useState } from 'react'
import { EventCard, EventCardData } from './EventCard'
import { isPast } from '@/app/utils/utils'

const fetchEvents = async (): Promise<EventCardData[]> => {
  const res = await fetch('/api/events', { cache: 'no-store' })
  return res.json()
}

export const Events = () => {
  const [events, setEvents] = useState<EventCardData[]>([])

  useEffect(() => {
    fetchEvents().then(setEvents)
  }, [])

  const upcomingEvents = events.filter(e => !e.event_date || !isPast(e.event_date))
  const pastEvents = events.filter(e => e.event_date && isPast(e.event_date))

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="mt-20 px-4 py-3">
        {/* Upcoming events */}
        {upcomingEvents.length > 0 && (
          <>
            <div className="mb-3 flex items-center gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Upcoming</h2>
              <div className="h-px flex-1 bg-stone-200" />
            </div>

            <ul className="list-none space-y-3">
              {upcomingEvents.map(entry => (
                <EventCard key={entry.id} asLink={true} entry={entry} />
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

            <ul className="list-none space-y-3">
              {pastEvents.map(entry => (
                <EventCard key={entry.id} asLink={true} entry={entry} />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
