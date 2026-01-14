import { useEffect } from 'react'
import usePanelStore from '@/stores/panelStore'
import { EventDetails } from '@/app/components/EventDetails'

export const useURLEventSync = () => {
  const { setPanelContent } = usePanelStore()

  useEffect(() => {
    const fetchEventFromURL = async () => {
      const params = new URLSearchParams(window.location.search)
      const eventId = params.get('event')

      if (!eventId) {
        return
      }

      try {
        const res = await fetch(`/api/events/${encodeURIComponent(eventId)}`)
        if (!res.ok) throw new Error('Event not found')
        const event = await res.json()
        setPanelContent(<EventDetails event={event} />, 'event')
      } catch (e) {
        console.error(e)
      }
    }

    fetchEventFromURL()
    window.addEventListener('popstate', fetchEventFromURL)
    return () => window.removeEventListener('popstate', fetchEventFromURL)
  }, [setPanelContent])
}
