import { useEffect } from 'react'
import usePanelStore from '@/stores/panelStore'
import { RoasterDetails } from '@/app/components/RoasterDetails'

export const useURLRoasterSync = () => {
  const { setPanelContent } = usePanelStore()

  useEffect(() => {
    const syncRoasterFromURL = () => {
      const params = new URLSearchParams(window.location.search)
      const roasterSlug = params.get('roaster')

      if (!roasterSlug) return

      setPanelContent(<RoasterDetails slug={roasterSlug} />, 'roaster')
    }

    syncRoasterFromURL()
    window.addEventListener('popstate', syncRoasterFromURL)
    return () => window.removeEventListener('popstate', syncRoasterFromURL)
  }, [setPanelContent])
}
