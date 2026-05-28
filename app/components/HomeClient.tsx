'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAnalytics } from '@/hooks'
import { TShop } from '@/types/shop-types'
import Panel from '@/app/components/Panel'
import ShopSearch from './ShopSearch'
import MapContainer from './MapContainer'
import { ExploreContent } from './ExploreContent'
import { useURLShopSync, useURLEventSync, useURLNewsSync, useMediaQuery } from '@/hooks'
import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'
import SearchFAB from './SearchFAB'
import { useURLCompanySync } from '@/hooks/useURLCompanySync'
import { useURLRoasterSync } from '@/hooks/useURLRoasterSync'

export default function HomeClient() {
  useAnalytics()
  const { fetchCoffeeShops, currentShop, setCurrentShop, searchValue, setSearchValue, clearAmenityFilters } =
    useShopsStore()
  const { panelContent, clearHistory, panelMode, setPanelContent } = usePanelStore()

  const largeViewport = useMediaQuery('(min-width: 1024px)')
  const [presented, setPresentedState] = useState(true)
  const { replace } = useRouter()

  const removeSearchParam = useCallback(() => {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    params.delete('shop')
    params.delete('company')
    params.delete('roaster')
    params.delete('news')
    params.delete('event')
    params.delete('events')
    url.search = params.toString()
    replace(url.toString())
  }, [replace])

  const handleClose = useCallback(() => {
    setSearchValue('')
    clearAmenityFilters()
    setCurrentShop({} as TShop)
    removeSearchParam()
    if (panelMode === 'shop') {
      setPanelContent(<ShopSearch />, 'search')
      clearHistory()
    } else {
      usePanelStore.getState().reset({ mode: 'explore', content: <ExploreContent /> })
      clearHistory()
    }
  }, [
    panelMode,
    setSearchValue,
    clearAmenityFilters,
    setCurrentShop,
    removeSearchParam,
    setPanelContent,
    clearHistory,
  ])

  // Wrap setPresented to perform close logic directly on dismissal
  const setPresented = useCallback(
    (next: boolean) => {
      setPresentedState(next)
      if (
        !next &&
        !largeViewport &&
        currentShop &&
        Object.keys(currentShop).length > 0
      ) {
        handleClose()
      }
    },
    [largeViewport, currentShop, handleClose],
  )

  useURLShopSync()
  useURLCompanySync()
  useURLRoasterSync()
  useURLNewsSync()
  useURLEventSync()

  useEffect(() => {
    if (!searchValue) return

    setPanelContent(<ShopSearch />, 'search')
  }, [searchValue, currentShop, setPanelContent])

  useEffect(() => {
    fetchCoffeeShops()
  }, [fetchCoffeeShops])

  useEffect(() => {
    if (!panelContent && panelMode === 'explore') {
      const params = new URLSearchParams(window.location.search)
      const hasContentParam = ['shop', 'company', 'roaster', 'news', 'event', 'events'].some(p => params.has(p))
      if (!hasContentParam) {
        setPanelContent(<ExploreContent />, 'explore')
      }
    }
  }, [panelContent, panelMode, setPanelContent])

  useEffect(() => {
    if (largeViewport) return
    if (currentShop && Object.keys(currentShop).length > 0) {
      setPresentedState(true)
      return
    }
    if (
      panelMode === 'company' ||
      panelMode === 'roaster' ||
      panelMode === 'event' ||
      panelMode === 'news' ||
      panelMode === 'events'
    ) {
      setPresentedState(true)
    }
  }, [currentShop, panelMode, largeViewport])

  useEffect(() => {
    if (currentShop?.properties?.name && currentShop?.properties?.neighborhood) {
      document.title = `${currentShop.properties.name} | ${currentShop.properties.neighborhood} | pgh.coffee`
    } else {
      document.title = 'PGH Coffee'
    }
  }, [currentShop])

  return (
    <div className="relative w-full h-full">
      {!largeViewport && !presented && <SearchFAB handleClick={() => setPresentedState(true)} />}
      <MapContainer
        currentShopCoordinates={[currentShop?.geometry?.coordinates[0], currentShop?.geometry?.coordinates[1]]}
      />
      <Panel shop={currentShop} presented={presented} onPresentedChange={setPresented}>
        {panelContent}
      </Panel>
    </div>
  )
}
