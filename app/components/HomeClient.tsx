'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { usePlausible } from 'next-plausible'
import { TShop } from '@/types/shop-types'
import Panel from '@/app/components/Panel'
import ShopSearch from './ShopSearch'
import { ExploreContent } from './ExploreContent'

const MapContainer = dynamic(() => import('./MapContainer'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-stone-100" />,
})
import { useURLShopSync, useURLEventSync, useURLNewsSync, useHighlightCurrentShop, useMediaQuery } from '@/hooks'
import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'
import SearchFAB from './SearchFAB'
import {useURLCompanySync} from '@/hooks/useURLCompanySync'
import {useURLRoasterSync} from '@/hooks/useURLRoasterSync'
import { doesShopMatchFilter } from '@/app/utils/utils'

export default function HomeClient() {
  const plausible = usePlausible()
  const { allShops, fetchCoffeeShops, currentShop, setCurrentShop, hoveredShop, displayedShops, setDisplayedShops } = useShopsStore()
  const { panelContent, clearHistory, searchValue, setSearchValue, panelMode, setPanelContent } = usePanelStore()

  const largeViewport = useMediaQuery('(min-width: 1024px)')
  const [presented, setPresented] = useState(false)
  const [mapReady, setMapReady] = useState(false)
  const router = useRouter()

  // Defer map loading - longer on mobile since panel covers the map
  useEffect(() => {
    // Desktop: load map after short delay
    // Mobile: load map after longer delay to prioritize panel interactivity
    const delay = largeViewport ? 100 : 3000
    const timer = setTimeout(() => setMapReady(true), delay)
    return () => clearTimeout(timer)
  }, [largeViewport])

  const removeSearchParam = () => {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    params.delete('shop')
    params.delete('company')
    params.delete('roaster')
    params.delete('news')
    params.delete('event')
    params.delete('events')
    url.search = params.toString()
    router.replace(url.toString())
  }

  const handleClose = () => {
    setDisplayedShops(allShops)
    setCurrentShop({} as TShop)
    removeSearchParam()
    if (panelMode === 'shop') {
      setSearchValue('')
      setPanelContent(<ShopSearch />, 'search')
      clearHistory()
    } else {
      usePanelStore.getState().reset({ mode: 'explore', content: <ExploreContent /> })
      setDisplayedShops(allShops)
      clearHistory()
    }
  }
  const filteredShops = useMemo(() => {
    if (!allShops) return { type: 'FeatureCollection' as const, features: [] }

    const filteredFeatures = allShops.features.filter(shop => {
      return doesShopMatchFilter(shop.properties.name, shop.properties.neighborhood, searchValue)
    })

    return {
      ...allShops,
      features: filteredFeatures,
    }
  }, [allShops, searchValue])

  useEffect(() => {
    setDisplayedShops(filteredShops)
  }, [filteredShops, setDisplayedShops])

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
      setPanelContent(<ExploreContent />, 'explore')
    }
  }, [panelContent, panelMode, setPanelContent])

  useEffect(() => {
    if (!largeViewport && currentShop && Object.keys(currentShop).length > 0) {
      setPresented(true)
    }
  }, [currentShop, largeViewport])

  useEffect(() => {
    if (!largeViewport && (panelMode === 'company' || panelMode === 'roaster' || panelMode === 'event')) {
      setPresented(true)
    }
  }, [panelMode, largeViewport])

  useEffect(() => {
    if (!largeViewport && !presented && currentShop && Object.keys(currentShop).length > 0) {
      handleClose()
    }
  }, [presented, largeViewport])

  useHighlightCurrentShop({ currentShop, displayedShops, setDisplayedShops })

  return (
    <div className="relative w-full h-full">
      {!largeViewport && !presented && <SearchFAB handleClick={() => setPresented(true)} />}
      {mapReady ? (
        <MapContainer
          currentShopCoordinates={[currentShop?.geometry?.coordinates[0], currentShop?.geometry?.coordinates[1]]}
        />
      ) : (
        <div className="absolute inset-0 bg-stone-100" />
      )}
      <Panel shop={currentShop} presented={presented} onPresentedChange={setPresented}>
        {panelContent}
      </Panel>
    </div>
  )
}
