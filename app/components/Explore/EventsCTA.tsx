'use client'

import { useEffect, useState } from 'react'
import { usePlausible } from 'next-plausible'
import usePanelStore from '@/stores/panelStore'
import { Events } from '@/app/components/Events'
import { EventCard, EventCardData } from '@/app/components/EventCard'

export const EventsCTA = () => {
  const plausible = usePlausible()
  const { setPanelContent } = usePanelStore()

  const fetchEvents = async () => {
    const response = await fetch('/api/events', { cache: 'no-store' })
    return await response.json()
  }

  const [updates, setUpdates] = useState<EventCardData[]>([])

  useEffect(() => {
    fetchEvents().then(setUpdates)
  }, [])

  const lastTwo = updates.slice(0, 2)
  const openEvents = () => {
    plausible('ViewAllClick', { props: { section: 'events' } })
    setPanelContent(<Events />, 'events')
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="flex-1 text-xs font-semibold uppercase tracking-wider text-stone-500">
          Upcoming events
        </h3>
        <button
          className="text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: 'lab(45 10 50)' }}
          onClick={openEvents}
        >
          View all
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {lastTwo.map((event) => (
          <EventCard
            key={event.id}
            entry={event}
            asLink={true}
            showDescription={false}
            showTime={false}
            showNewPill={false}
          />
        ))}
      </div>
    </>
  )
}
