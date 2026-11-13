import { useEffect } from 'react'
import useCoffeeShopsStore from '@/stores/coffeeShopsStore'
import { areaForNeighborhood } from '@/app/utils/neighborhoodAreas'

/**
 * Keeps the search filter in sync with the `neighborhood` URL param.
 * Setting a non-empty search value causes HomeClient to open the search panel.
 */
export const useURLNeighborhoodSync = () => {
  const setSearchValue = useCoffeeShopsStore(s => s.setSearchValue)
  const setAreaFilter = useCoffeeShopsStore(s => s.setAreaFilter)

  const syncFromURL = () => {
    const neighborhood = new URLSearchParams(window.location.search).get('neighborhood')
    if (neighborhood) setAreaFilter(areaForNeighborhood(neighborhood))
    else setSearchValue('')
  }

  useEffect(() => {
    syncFromURL()
    window.addEventListener('popstate', syncFromURL)
    return () => window.removeEventListener('popstate', syncFromURL)
    // only run on mount
    // eslint-disable-next-line
  }, [])
}
