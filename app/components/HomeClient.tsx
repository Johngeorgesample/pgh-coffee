'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePlausible } from 'next-plausible'
import { TShop } from '@/types/shop-types'
import Footer from '@/app/components/Footer'
import ShopPanel from '@/app/components/ShopPanel'
import ShopDetails from '@/app/components/ShopDetails'
import ShopSearch from './ShopSearch'
import MapContainer from './MapContainer'
import { DISTANCE_UNITS } from '../settings/DistanceUnitsDialog'
import useShopsStore from '@/stores/coffeeShopsStore'
import useSearchStore from '@/stores/searchStore'
import { usePanelStore } from '@/stores/panelStore'
import useCurrentShopStore from '@/stores/currentShopStore'
import SearchFAB from '@/app/components/SearchFAB'
import { Explore } from '@/app/components/Explore'
import SearchBar from './SearchBar'

export default function HomeClient() {
  const plausible = usePlausible()
  const { coffeeShops, fetchCoffeeShops } = useShopsStore()
  const { searchValue, getFilteredShops } = useSearchStore()
  const { setPanel, content: panelContent } = usePanelStore()
  const { currentShop, clearCurrentShop } = useCurrentShopStore()
  const [dataSet, setDataSet] = useState({
    type: 'FeatureCollection',
    features: [] as TShop[],
  })
  const router = useRouter()

  const appendSearchParamToURL = (shop: TShop) => {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    params.set('shop', `${shop.properties.name}_${shop.properties.neighborhood}`)
    url.search = params.toString()
    router.push(url.toString())
  }

  const removeSearchParam = () => {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    params.delete('shop')
    url.search = params.toString()
    router.replace(url.toString())
  }

  const handleUpdatingCurrentShop = (shop: TShop) => {
    if (Object.keys(shop).length) {
      appendSearchParamToURL(shop)
    }
  }

  const handleNearbyShopClick = (shopFromShopPanel: TShop) => {
    handleUpdatingCurrentShop(shopFromShopPanel)
    document.getElementById('header')?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchShopFromURL = async () => {
    const params = new URLSearchParams(window.location.search)
    const shop = params.get('shop')

    if (shop) {
      try {
        const response = await fetch(`/api/shops/${shop}`)
        if (!response.ok) throw new Error('Shop not found')

        const data = await response.json()
      } catch (err) {
        console.log(err)
      }
    } else {
      clearCurrentShop()
    }
  }

  const updateCurrentShopMarker = () => {
    const newData = {
      ...dataSet,
      features: dataSet.features.map((f: TShop) => {
        const isSelected =
          f.properties.address === currentShop?.properties?.address && f.properties.name === currentShop?.properties?.name
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

  const handleDefaultDistanceUnits = () => {
    if (typeof window !== 'undefined') {
      if (!window.localStorage.getItem('distanceUnits')) {
        window.localStorage.setItem('distanceUnits', DISTANCE_UNITS.Miles)
      }
    }
  }

  useEffect(() => {
    fetchCoffeeShops()
  }, [fetchCoffeeShops])

  useEffect(() => {
    if (!panelContent) {
      setPanel('explore', <Explore />)
    }
  }, [])

  useEffect(() => {
    if (coffeeShops) {
      setDataSet(coffeeShops)
    }
  }, [coffeeShops])

  useEffect(() => {
    fetchShopFromURL()
    window.addEventListener('popstate', fetchShopFromURL)
    return () => window.removeEventListener('popstate', fetchShopFromURL)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(handleDefaultDistanceUnits, [])

  useEffect(
    updateCurrentShopMarker,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentShop],
  )

  useEffect(() => {
    if (searchValue.trim()) {
      setPanel('search', <ShopSearch handleResultClick={handleNearbyShopClick} />)
    } else {
      setPanel('explore', <Explore />)
    }
  }, [searchValue, setPanel])

  return (
    <>
      {/* @TODO currentShop is only used for coordinates (and properties to avoid rendering search) */}
      <div className="relative w-full lg:w-2/3">
        <SearchBar />
        <MapContainer
          dataSet={{
            ...dataSet,
            features: getFilteredShops(dataSet.features)
          }}
          currentShopCoordinates={[currentShop?.geometry?.coordinates[0], currentShop?.geometry?.coordinates[1]]}
          onShopSelect={(properties, geometry, type) => {
            const shop = {
              properties,
              geometry,
              type,
            } as TShop
            handleUpdatingCurrentShop(shop)
            plausible('FeaturePointClick', {
              props: {
                shopName: properties.name,
                neighborhood: properties.neighborhood,
              },
            })
          }}
        />
      </div>
      <ShopPanel handlePanelContentClick={handleNearbyShopClick} shop={currentShop}>
        {panelContent}
      </ShopPanel>
    </>
  )
}
