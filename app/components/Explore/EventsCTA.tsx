'use client'

import usePanelStore from '@/stores/panelStore'
import { Events } from '@/app/components/Events'
export const EventsCTA = () => {
  const { setPanelContent } = usePanelStore()

  const openEvents = () => setPanelContent(<Events />, 'events')

  return (
    <div className="sm:col-span-2">
      <div className="bg-yellow-50 rounded-md p-4">
        <h3 className="text-lg font-bold mb-2">Upcoming Events</h3>
        <p className="text-sm text-gray-700 mb-4">Latte art throwdowns, pop-ups, and more.</p>
        <button onClick={openEvents} className="text-yellow-800 font-medium hover:underline">
          Browse all events →
        </button>
      </div>
    </div>
  )
}
