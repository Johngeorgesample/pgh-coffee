import { useEffect } from 'react'
import usePanelStore from '@/stores/panelStore'
import { RoasterDetails } from '@/app/components/RoasterDetails'

export const useURLRoasterSync = () => {
  const { setPanelContent } = usePanelStore()

  useEffect(() => {
    const fetchRoasterFromURL = async () => {
      const params = new URLSearchParams(window.location.search)
      const roasterSlug = params.get('roaster')

      if (!roasterSlug) {
        return
      }

      try {
        const res = await fetch(`/api/roasters/${roasterSlug}`)
        if (!res.ok) throw new Error('Roaster not found')
        await res.json()
        setPanelContent(<RoasterDetails slug={roasterSlug} />, 'roaster')
      } catch (e) {
        console.error(e)
      }
    }

    fetchRoasterFromURL()
    window.addEventListener('popstate', fetchRoasterFromURL)
    return () => window.removeEventListener('popstate', fetchRoasterFromURL)
  }, [setPanelContent])
}
