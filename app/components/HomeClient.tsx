'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePlausible } from 'next-plausible'
import { TShop } from '@/types/shop-types'
import Footer from '@/app/components/Footer'
import Panel from '@/app/components/Panel'
import MapContainer from './MapContainer'
import { ExploreContent } from './ExploreContent'
import { useURLShopSync, useShopSelection, useHighlightCurrentShop } from '@/hooks'
import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'

export default function HomeClient() {
  const plausible = usePlausible()
  const { coffeeShops, fetchCoffeeShops, currentShop, setCurrentShop } = useShopsStore()
  const { searchValue, setSearchValue, panelContent, setPanelContent } = usePanelStore()
  const [displayedShops, setDisplayedShops] = useState({
    type: 'FeatureCollection',
    features: [] as TShop[],
  })
  const { handleShopSelect } = useShopSelection()
  const router = useRouter()

  const removeSearchParam = () => {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    params.delete('shop')
    url.search = params.toString()
    router.replace(url.toString())
  }

  const handleClose = () => {
    setDisplayedShops(coffeeShops)
    removeSearchParam()
  }

  useURLShopSync(handleClose)

  useEffect(() => {
    fetchCoffeeShops()
  }, [fetchCoffeeShops])

  useEffect(() => {
    if (coffeeShops) {
      setDisplayedShops(coffeeShops)
    }
  }, [coffeeShops])

  useEffect(() => {
    if (!panelContent) {
      setPanelContent(<ExploreContent />, 'explore')
    }
  }, [panelContent, setPanelContent])

  useHighlightCurrentShop({currentShop, displayedShops, setDisplayedShops})

  return (
    <>
      <MapContainer
        displayedShops={displayedShops}
        currentShopCoordinates={[
          currentShop?.geometry?.coordinates[0],
          currentShop?.geometry?.coordinates[1],
        ]}
        onShopSelect={handleShopSelect}
      />
      <Footer />
      <Panel shop={currentShop} foo={handleClose}>
        {panelContent}
      </Panel>
    </>
  )
}
