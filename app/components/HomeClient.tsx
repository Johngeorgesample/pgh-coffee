'use client'

import { useEffect, useState } from 'react'
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
  const [panelContent, setPanelContent] = useState<React.ReactNode>()
  const [dataSet, setDataSet] = useState({
    type: 'FeatureCollection',
    features: [] as TShop[],
  })

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
          setPanelContent(
            <ShopDetails shop={data} handlePanelContentClick={handleNearbyShopClick} emitClose={handleClose} />,
          )
        } catch (err) {
          console.log(err)
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

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.localStorage.getItem('distanceUnits')) {
        window.localStorage.setItem('distanceUnits', DISTANCE_UNITS.Miles)
      }
    }
  }, [])

  // Update color of currentShop dot
  useEffect(() => {
    const newData = {
      ...dataSet,
      features: dataSet.features.map((f: TShop) => {
        const isSelected = f.properties.address === currentShop.properties?.address
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
  }, [currentShop])

  const handleUpdatingCurrentShop = (shop: TShop) => {
    setCurrentShop(shop)
    setPanelContent(<ShopDetails shop={shop} handlePanelContentClick={handleNearbyShopClick} emitClose={handleClose} />)
    if (Object.keys(shop).length) {
      appendSearchParamToURL(shop)
    }
  }

  const appendSearchParamToURL = (shop: TShop) => {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    params.set('shop', `${shop.properties.name}_${shop.properties.neighborhood}`)
    url.search = params.toString()
    history.pushState({}, '', url.toString())
  }

  const removeSearchParam = () => {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    params.delete('shop')
    url.search = params.toString()
    history.replaceState({}, '', url.toString())
  }

  const handleClose = () => {
    setIsOpen(false)
    setDataSet(coffeeShops)
    removeSearchParam()
  }

  const handleSearchClick = () => {
    if (Object.keys(coffeeShops).length) {
      handleUpdatingCurrentShop({} as TShop)
      setIsOpen(true)
      setPanelContent(<ShopSearch handleResultClick={handleNearbyShopClick} />)

      plausible('SearchClick', {
        props: {},
      })
    }
  }

  const handleNearbyShopClick = (shopFromShopPanel: TShop) => {
    handleUpdatingCurrentShop(shopFromShopPanel)
    document.getElementById('header')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <MapContainer 
        dataSet={dataSet}
        currentShop={currentShop}
        currentShopAddress={currentShop.properties?.address}
        onShopSelect={(properties, geometry, type) => {
          const shop = {
            properties,
            geometry,
            type
          } as TShop
          setIsOpen(true)
          handleUpdatingCurrentShop(shop)
          plausible('FeaturePointClick', {
            props: {
              shopName: properties.name,
              neighborhood: properties.neighborhood,
            },
          })
        }}
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
