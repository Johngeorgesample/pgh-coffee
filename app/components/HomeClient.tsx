'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePlausible } from 'next-plausible'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { TShop } from '@/types/shop-types'
import Footer from '@/app/components/Footer'
import ShopPanel from '@/app/components/ShopPanel'
import ShopDetails from '@/app/components/ShopDetails'
import ShopSearch from './ShopSearch'
import MapContainer from './MapContainer'
import { DISTANCE_UNITS } from '../settings/DistanceUnitsDialog'
import useShopsStore from '@/stores/coffeeShopsStore'

export default function HomeClient() {
  const plausible = usePlausible()
  const { coffeeShops, fetchCoffeeShops } = useShopsStore()
  const [isOpen, setIsOpen] = useState(false)
  const [currentShop, setCurrentShop] = useState({} as TShop)
  const [dataSet, setDataSet] = useState({
    type: 'FeatureCollection',
    features: [] as TShop[],
  })

  const appendSearchParamToURL = useCallback((shop: TShop) => {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    params.set('shop', `${shop.properties.name}_${shop.properties.neighborhood}`)
    url.search = params.toString()
    history.pushState({}, '', url.toString())
  }, [])

  const removeSearchParam = useCallback(() => {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    params.delete('shop')
    url.search = params.toString()
    history.replaceState({}, '', url.toString())
  }, [])

const handleClose = useCallback(() => {
  setIsOpen(false);
  // Reset selected state for all shops
  setDataSet(prevDataSet => ({
    ...prevDataSet,
    features: prevDataSet.features.map(f => ({
      ...f,
      properties: {
        ...f.properties,
        selected: false, // Reset selected state
      },
    })),
  }));
  removeSearchParam();
}, [removeSearchParam]);

  const handleUpdatingCurrentShop = useCallback(
    (shop: TShop) => {
      setCurrentShop(shop)
      if (Object.keys(shop).length) {
        appendSearchParamToURL(shop)
      }
    },
    [appendSearchParamToURL],
  )

  const handleNearbyShopClick = useCallback(
    (shopFromShopPanel: TShop) => {
      handleUpdatingCurrentShop(shopFromShopPanel)
      document.getElementById('header')?.scrollIntoView({ behavior: 'smooth' })
    },
    [handleUpdatingCurrentShop],
  )

  const handleSearchClick = useCallback(() => {
    if (Object.keys(coffeeShops).length) {
      handleUpdatingCurrentShop({} as TShop)
      setIsOpen(true)

      plausible('SearchClick', {
        props: {},
      })
    }
  }, [coffeeShops, handleUpdatingCurrentShop, plausible])

  const panelContent = useMemo(() => {
    if (!Object.keys(currentShop).length) {
      return <ShopSearch handleResultClick={handleNearbyShopClick} />
    }
    return <ShopDetails shop={currentShop} handlePanelContentClick={handleNearbyShopClick} emitClose={handleClose} />
  }, [currentShop, handleNearbyShopClick, handleClose])

  const mappedDataSet = useMemo(
    () => ({
      type: 'FeatureCollection',
      features:
        dataSet.features?.map((f: TShop) => ({
          ...f,
          properties: {
            ...f.properties,
            selected:
              f.properties.address === currentShop.properties?.address &&
              f.properties.name === currentShop.properties?.name,
          },
        })) || [],
    }),
    [dataSet, currentShop.properties?.address, currentShop.properties?.name],
  )

  useEffect(() => {
    fetchCoffeeShops()
  }, [fetchCoffeeShops])

  useEffect(() => {
    if (coffeeShops) {
      setDataSet(coffeeShops)
    }
  }, [coffeeShops])

  useEffect(() => {
    const fetchShopFromURL = async () => {
      const params = new URLSearchParams(window.location.search)
      const shop = params.get('shop')

      if (shop) {
        try {
          const response = await fetch(`/api/shops/${shop}`)
          if (!response.ok) throw new Error('Shop not found')

          const data = await response.json()
          setIsOpen(true)
          setCurrentShop(data)
        } catch (err) {
          console.error('Error fetching shop:', err)
        }
      } else {
        setCurrentShop({} as TShop)
        setIsOpen(false)
      }
    }

    fetchShopFromURL()

    const handlePopState = () => {
      fetchShopFromURL()
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.localStorage.getItem('distanceUnits')) {
      window.localStorage.setItem('distanceUnits', DISTANCE_UNITS.Miles)
    }
  }, [])

const handleShopSelect = useCallback(
  (properties: any, geometry: any, type: any) => {
    const shop = {
      properties,
      geometry,
      type,
    } as TShop;

    setIsOpen(true);
    handleUpdatingCurrentShop(shop);

    // Update dataSet to mark the selected shop
    setDataSet(prevDataSet => {
      const newFeatures = prevDataSet.features.map((f: TShop) => {
        const isSelected = (f.properties.address === shop.properties.address && f.properties.name === shop.properties.name);
        return {
          ...f,
          properties: {
            ...f.properties,
            selected: isSelected, // Mark the selected shop
          },
        };
      });

      return {
        ...prevDataSet,
        features: newFeatures,
      };
    });

    plausible('FeaturePointClick', {
      props: {
        shopName: properties.name,
        neighborhood: properties.neighborhood,
      },
    });
  },
  [handleUpdatingCurrentShop, plausible]
);

  return (
    <>
      <MapContainer
        dataSet={mappedDataSet}
        currentShop={currentShop}
        currentShopAddress={currentShop.properties?.address}
        onShopSelect={handleShopSelect}
      />
      <button
        aria-label="Search shops"
        className="absolute bottom-[10%] right-[5%] bg-yellow-300 hover:bg-yellow-400 rounded-full h-16 w-16 flex justify-center items-center"
        onClick={handleSearchClick}
      >
        <MagnifyingGlassIcon className="h-8 w-8" />
      </button>
      <Footer />
      <ShopPanel
        handlePanelContentClick={handleNearbyShopClick}
        shop={currentShop}
        panelIsOpen={isOpen}
        emitClose={handleClose}
      >
        {panelContent}
      </ShopPanel>
    </>
  )
}
