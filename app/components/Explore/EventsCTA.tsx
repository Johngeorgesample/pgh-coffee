'use client'

import { useEffect, useState } from 'react'
import { usePlausible } from 'next-plausible'
import { ChevronRight } from 'lucide-react'
import usePanelStore from '@/stores/panelStore'
import { Events } from '@/app/components/Events'
import { EventCard, EventCardData } from '@/app/components/EventCard'

const EventCardSkeleton = () => (
  <div className="flex w-full bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm animate-pulse">
    <div className="w-14 flex flex-col items-center justify-center py-4 shrink-0 bg-stone-200">
      <div className="h-2 w-6 bg-stone-300 rounded mb-1" />
      <div className="h-6 w-6 bg-stone-300 rounded" />
    </div>
    <div className="flex-1 p-4">
      <div className="h-5 w-3/4 bg-stone-200 rounded mb-2" />
      <div className="flex items-center gap-1 mb-2">
        <div className="h-3 w-3 bg-stone-200 rounded" />
        <div className="h-3 w-24 bg-stone-200 rounded" />
        <div className="h-3 w-16 bg-stone-100 rounded ml-2" />
      </div>
      <div className="h-4 w-full bg-stone-100 rounded" />
    </div>
  </div>
)

export const EventsCTA = () => {
  const plausible = usePlausible()
  const { setPanelContent } = usePanelStore()

  const fetchEvents = async () => {
    const response = await fetch('/api/events', { cache: 'no-store' })
    return await response.json()
  }

  const [updates, setUpdates] = useState<EventCardData[] | null>(null)

  useEffect(() => {
    fetchEvents().then(setUpdates)
  }, [])

  const isLoading = updates === null
  const lastTwo = updates?.slice(0, 2) ?? []

  const openEvents = () => {
    plausible('ViewAllClick', { props: { section: 'events' } })
    setPanelContent(<Events />, 'events')

    const url = new URL(window.location.href)
    url.searchParams.delete('shop')
    url.searchParams.delete('company')
    url.searchParams.delete('roaster')
    url.searchParams.delete('news')
    url.searchParams.delete('event')
    const baseUrl = url.origin + url.pathname
    window.history.replaceState({}, '', baseUrl + '?events')
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="flex-1 text-xs font-semibold uppercase tracking-wider text-stone-500">Upcoming events</h3>
        <button
          className="flex gap-0.5 items-center text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: 'lab(45 10 50)' }}
          onClick={openEvents}
        >
          View all
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {isLoading ? (
          <>
            <EventCardSkeleton />
            <EventCardSkeleton />
          </>
        ) : (
          lastTwo.map(event => <EventCard key={event.id} entry={event} />)
        )}
      </div>
    </>
  )
}
