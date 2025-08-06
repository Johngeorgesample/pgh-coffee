'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePlausible } from 'next-plausible'
import { TFeatureCollection, TShop } from '@/types/shop-types'
import Footer from '@/app/components/Footer'
import Panel from '@/app/components/Panel'
import ShopSearch from './ShopSearch'
import MapContainer from './MapContainer'
import { ExploreContent } from './ExploreContent'
import { useURLShopSync, useHighlightCurrentShop } from '@/hooks'
import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'

export default function HomeClient() {
  const plausible = usePlausible()
  const { allShops, fetchCoffeeShops, currentShop, setCurrentShop, hoveredShop } = useShopsStore()
  const { panelContent, setSearchValue, panelMode, setPanelContent } = usePanelStore()
  const [displayedShops, setDisplayedShops] = useState<TFeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  })
  const router = useRouter()

  const removeSearchParam = () => {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    params.delete('shop')
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
    } else {
      setPanelContent(<ExploreContent />, 'explore')
    }
  }
  useEffect(() => {
    if (allShops) {
      setDisplayedShops({
        ...allShops,
        features: allShops.features.map(shop => ({
          ...shop,
          properties: {
            ...shop.properties,
            hovered: hoveredShop ? JSON.stringify(shop) === JSON.stringify(hoveredShop) : false,
          },
        })),
      })
    }
  }, [allShops, hoveredShop])

  useURLShopSync(handleClose)

  useEffect(() => {
    fetchCoffeeShops()
  }, [fetchCoffeeShops])

  useEffect(() => {
    if (!panelContent) {
      setPanelContent(<ExploreContent />, 'explore')
    }
  }, [panelContent, setPanelContent])

  useHighlightCurrentShop({ currentShop, displayedShops, setDisplayedShops })

  return (
    <>
      <MapContainer
        displayedShops={displayedShops}
        currentShopCoordinates={[currentShop?.geometry?.coordinates[0], currentShop?.geometry?.coordinates[1]]}
      />
      <Footer />
      <Panel shop={currentShop} foo={handleClose}>
        {panelContent}
      </Panel>
    </>
  )
}
