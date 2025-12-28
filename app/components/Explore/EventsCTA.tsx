'use client'

import { useEffect, useState } from 'react'
import { Event } from '@/types/news-types'
import { fmtYMD } from '@/app/utils/utils'
import usePanelStore from '@/stores/panelStore'
import { Events } from '@/app/components/Events'
import { ArrowTopRightOnSquareIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline'

export const EventsCTA = () => {
  const { setPanelContent } = usePanelStore()

  const fetchEvents = async () => {
    const response = await fetch('/api/events', { cache: 'no-store' })
    return await response.json()
  }

  const [updates, setUpdates] = useState([])

  useEffect(() => {
    fetchEvents().then(setUpdates)
  }, [])

  const lastTwo = updates.slice(0, 2)
  const openEvents = () => setPanelContent(<Events />, 'events')

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
        {lastTwo.map((event: Event) => (
          <a
            key={event.id}
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div
              className="
                relative overflow-hidden rounded-xl border border-stone-200 bg-white
                shadow-sm transition-all duration-200 
                hover:border-stone-300 hover:shadow-md
              "
            >
              {/* Yellow accent bar */}
              <div
                className="absolute bottom-0 left-0 top-0 w-1"
                style={{ backgroundColor: 'lab(89.7033 -0.480294 84.4917)' }}
              />

              <div className="p-4 pl-5">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-base font-semibold leading-tight text-stone-900">
                    {event.title}
                  </h4>
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 shrink-0 text-stone-400 transition-colors group-hover:text-stone-600" />
                </div>

                {/* Meta info */}
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500">
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    <span className="font-semibold" style={{ color: 'lab(45 10 50)' }}>
                      {fmtYMD(event.event_date)}
                    </span>
                  </span>
                </div>

                {/* Venue */}
                <div className="mt-2 flex items-center gap-1.5 text-sm">
                  <MapPinIcon className="h-3.5 w-3.5 text-stone-400" />
                  <span className="font-medium text-stone-700">{event.shop.name}</span>
                  <span className="text-stone-300">·</span>
                  <span className="text-stone-500">{event.shop.neighborhood}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </>
  )
}
