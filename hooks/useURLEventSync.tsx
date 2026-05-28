import { useEffect } from 'react'
import usePanelStore from '@/stores/panelStore'
import { EventDetails } from '@/app/components/EventDetails'
import { Events } from '@/app/components/Events'

const fetchEvent = async (eventId: string) => {
  const res = await fetch(`/api/events/${encodeURIComponent(eventId)}`)
  if (!res.ok) throw new Error('Event not found')
  return res.json()
}

export const useURLEventSync = () => {
  const { setPanelContent } = usePanelStore()

  useEffect(() => {
    const syncEventFromURL = () => {
      const params = new URLSearchParams(window.location.search)
      const eventId = params.get('event')
      const hasEventsList = params.has('events')

      if (hasEventsList) {
        setPanelContent(<Events />, 'events')
        return
      }

      if (!eventId) return

      fetchEvent(eventId)
        .then(event => setPanelContent(<EventDetails event={event} />, 'event'))
        .catch(e => console.error(e))
    }

    syncEventFromURL()
    window.addEventListener('popstate', syncEventFromURL)
    return () => window.removeEventListener('popstate', syncEventFromURL)
  }, [setPanelContent])
}
