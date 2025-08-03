'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePlausible } from 'next-plausible'
import { TShop } from '@/types/shop-types'
import Footer from '@/app/components/Footer'
import ShopPanel from '@/app/components/ShopPanel'
import MapContainer from './MapContainer'
import { ExploreContent } from './ExploreContent'
import { useURLShopSync, useShopSelection } from '@/hooks'
import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'

export default function HomeClient() {
  const plausible = usePlausible()
  const { coffeeShops, fetchCoffeeShops, currentShop, setCurrentShop } = useShopsStore()
  const { searchValue, setSearchValue, panelContent, setPanelContent } = usePanelStore()
  const [dataSet, setDataSet] = useState({
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
    setDataSet(coffeeShops)
    removeSearchParam()
  }

  useURLShopSync(handleClose)

  const updateCurrentShopMarker = () => {
    const newData = {
      ...dataSet,
      features: dataSet.features.map((f: TShop) => {
        const isSelected =
          f.properties.address === currentShop.properties?.address &&
          f.properties.name === currentShop.properties?.name
        return {
          ...f,
          properties: {
            ...f.properties,
            selected: isSelected,
          },
        }
      }),
    }
    setDataSet(newData)
  }

  useEffect(() => {
    fetchCoffeeShops()
  }, [fetchCoffeeShops])

  useEffect(() => {
    if (coffeeShops) {
      setDataSet(coffeeShops)
    }
  }, [coffeeShops])

  useEffect(() => {
    if (!panelContent) {
      setPanelContent(<ExploreContent />, 'explore')
    }
  }, [panelContent, setPanelContent])

  useEffect(updateCurrentShopMarker, [currentShop])

  return (
    <>
      <MapContainer
        dataSet={dataSet}
        currentShopCoordinates={[
          currentShop?.geometry?.coordinates[0],
          currentShop?.geometry?.coordinates[1],
        ]}
        onShopSelect={handleShopSelect}
      />
      <Footer />
      <ShopPanel shop={currentShop} foo={handleClose}>
        {panelContent}
      </ShopPanel>
    </>
  )
}
