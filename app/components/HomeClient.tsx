'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePlausible } from 'next-plausible'
import { TShop } from '@/types/shop-types'
import Footer from '@/app/components/Footer'
import Panel from '@/app/components/Panel'
import ShopSearch from './ShopSearch'
import MapContainer from './MapContainer'
import { ExploreContent } from './ExploreContent'
import { useURLShopSync, useHighlightCurrentShop } from '@/hooks'
import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'
import SearchBar from './SearchBar'
import { useClientMediaQuery } from '@silk-hq/components'

export default function HomeClient() {
  const plausible = usePlausible()
  const { allShops, fetchCoffeeShops, currentShop, setCurrentShop, hoveredShop, displayedShops, setDisplayedShops } = useShopsStore()
  const { panelContent, clearHistory, searchValue, setSearchValue, panelMode, setPanelContent } = usePanelStore()

  const largeViewport = useClientMediaQuery('(min-width: 1024px)')
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
      clearHistory()
    } else {
      usePanelStore.getState().reset({ mode: 'explore', content: <ExploreContent /> })
      console.log(allShops)
      setDisplayedShops(allShops)
      clearHistory()
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
    // No search value, nothing to do
    if (!searchValue) return

    // If a shop is selected AND the searchValue was just set to its name,
    // treat it as a shop click → don't switch to search panel
    if (currentShop?.properties?.uuid && searchValue === currentShop.properties?.name) {
      return
    }

    // Otherwise (typed, chip, whatever) → show search panel
    setPanelContent(<ShopSearch />, 'search')
  }, [searchValue, currentShop, setPanelContent])

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
      {!largeViewport && <SearchBar onClose={handleClose} />}
      <MapContainer
        currentShopCoordinates={[currentShop?.geometry?.coordinates[0], currentShop?.geometry?.coordinates[1]]}
      />
      <Footer />
      <Panel shop={currentShop} foo={handleClose}>
        {panelContent}
      </Panel>
    </>
  )
}
