import { useEffect } from 'react'
import usePanelStore from '@/stores/panelStore'
import { ListMapView } from '@/app/components/ListMapView'

export const useURLListSync = () => {
  const { setPanelContent } = usePanelStore()

  const fetchListFromURL = async () => {
    const params = new URLSearchParams(window.location.search)
    const listId = params.get('list')

    if (!listId) return

    try {
      const res = await fetch(`/api/lists/${listId}`)
      if (!res.ok) throw new Error('List not found')
      setPanelContent(<ListMapView listId={listId} />, 'list')
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchListFromURL()
    window.addEventListener('popstate', fetchListFromURL)
    return () => window.removeEventListener('popstate', fetchListFromURL)
    // only run on mount
    // eslint-disable-next-line
  }, [])
}
