import { useEffect } from 'react'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import usePanelStore from '@/stores/panelStore'
import { EventDetails } from '@/app/components/EventDetails'
import { Events } from '@/app/components/Events'

/**
 * Syncs the panel from the events routes: `/events/{slug}` opens a single event,
 * `/?events` opens the events list. The `slug` param is shared by every
 * `[slug]` route, so the `/events/` pathname guard keeps this from firing on
 * shop/news pages.
 */
export const useEventRouteSync = () => {
  const { slug } = useParams<{ slug?: string }>()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { setPanelContent } = usePanelStore()

  const onEventRoute = pathname.startsWith('/events/')
  const hasEventsList = searchParams.has('events')

  useEffect(() => {
    if (onEventRoute && slug) {
      fetch(`/api/events/by-slug/${encodeURIComponent(slug)}`)
        .then(res => (res.ok ? res.json() : Promise.reject(new Error('Event not found'))))
        .then(event => setPanelContent(<EventDetails event={event} />, 'event'))
        .catch(console.error)
      return
    }

    if (hasEventsList) {
      setPanelContent(<Events />, 'events')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, onEventRoute, hasEventsList])
}
