'use client'

import { useEffect, useState } from 'react'

import { Event } from '@/types/news-types'
import { fmtYMD } from '@/app/utils/utils'
import usePanelStore from '@/stores/panelStore'
import { Events } from '@/app/components/Events'
export const EventsCTA = () => {
  const { setPanelContent } = usePanelStore()

  const foo = async () => {
    const response = await fetch('/api/events')
    return await response.json()
  }

  const [updates, setUpdates] = useState([])

  useEffect(() => {
    foo().then(setUpdates)
  }, [])

  const lastTwo = updates.slice(-2)

  const openEvents = () => setPanelContent(<Events />, 'events')

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="uppercase text-xs flex-1">Upcoming events</h3>

        <button className="text-zinc-500 text-sm" onClick={openEvents}>
          View all
        </button>
      </div>
      <div className="mt-2">
        {lastTwo.map((event: Event) => (
          <a key={event.id} href={event.url} target="_blank">
            <div className="bg-gradient-to-br from-[#FFD700] to-[#FFA500] w-full mb-2 p-3 rounded-md">
              <p className="text-sm">{fmtYMD(event.event_date)}</p>
              <p>
                {event.title} @ {event.shop.name}
              </p>
              <div className="text-sm flex gap-2">
                <p>{event.shop.neighborhood}</p> <p>•</p> <p>{event.type}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </>
  )
}
