'use client'

import { useRef, useEffect, useState } from 'react'
import { usePlausible } from 'next-plausible'
import Map, { Source, Layer, Marker, ViewStateChangeEvent } from 'react-map-gl'
import { MapMouseEvent } from 'mapbox-gl'
import Footer from '@/app/components/Footer'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { TShop } from '@/types/shop-types'
import ShopPanel from '@/app/components/ShopPanel'
import ShopList from '@/app/components/ShopList'
import ShopDetails from '@/app/components/ShopDetails'

import { DISTANCE_UNITS } from './settings/DistanceUnitsDialog'
import useShopsStore from '@/stores/coffeeShopsStore'
import ShopSearch from './components/ShopSearch'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function Home() {
  const plausible = usePlausible()
  const { coffeeShops, fetchCoffeeShops } = useShopsStore()
  const [isOpen, setIsOpen] = useState(false)
  const [currentShop, setCurrentShop] = useState({} as TShop)
  const [panelContent, setPanelContent] = useState<React.ReactNode>()
  const [dataSet, setDataSet] = useState({
    type: 'FeatureCollection',
    features: [] as TShop[],
  })
  const [zoomLevel, setZoomLevel] = useState(12)

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
          setCurrentShop(data)
          setIsOpen(true)
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

  const mapRef = useRef(null)
  const layerId = 'myPoint'

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

  const handleMapClick = (event: MapMouseEvent) => {
    // @ts-ignore-next-line
    const map = mapRef.current?.getMap()
    const features = map.queryRenderedFeatures(event.point, {
      layers: [layerId],
    })

    if (features.length) {
      setIsOpen(true)
      handleUpdatingCurrentShop({
        geometry: { ...features[0].geometry },
        properties: { ...features[0].properties },
        type: features[0].type,
      })
      plausible('FeaturePointClick', { props: {} })
    }
  }

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

  // Pan to currentShop
  useEffect(() => {
    if (currentShop.properties) {
      if (mapRef.current && currentShop) {
        // @ts-ignore-next-line
        mapRef.current.flyTo({
          // @ts-ignore-next-line
          center: [currentShop.geometry.coordinates[0], currentShop.geometry.coordinates[1]],
          // @ts-ignore-next-line
          zoom: mapRef.current?.getZoom(),
          bearing: 0,
          pitch: 0,
          duration: 1000,
          essential: true,
        })
      }
    }
  }, [currentShop])

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
    }
  }

  const handleSearchThisArea = () => {
    // @ts-ignore-next-line
    const bounds = mapRef.current.getMap().getBounds()
    const [sw, ne] = [bounds.getSouthWest(), bounds.getNorthEast()]

    const inView = coffeeShops.features.filter((shop: TShop) => {
      const [longitude, latitude] = shop.geometry.coordinates
      return latitude >= sw.lat && latitude <= ne.lat && longitude >= sw.lng && longitude <= ne.lng
    })

    console.log(inView)
    setDataSet({
      ...dataSet,
      features: inView,
    })
    setIsOpen(true)
    console.log(inView)
    // setPanelContent(<ShopSearch />)
    setPanelContent(
      <div className="px-4 sm:px-6">
        <ShopList coffeeShops={inView} handleCardClick={handleNearbyShopClick} />
      </div>,
    )
  }

  const handleNearbyShopClick = (shopFromShopPanel: TShop) => {
    handleUpdatingCurrentShop(shopFromShopPanel)
    document.getElementById('header')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Map
        mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          longitude: -79.99585,
          latitude: 40.440742,
          zoom: 12,
        }}
        cursor="pointer"
        mapStyle="mapbox://styles/mapbox/dark-v11"
        onClick={handleMapClick}
        onMove={(e: ViewStateChangeEvent) => setZoomLevel(e.viewState.zoom)}
        ref={mapRef}
      >
        <Source id="my-data" type="geojson" data={dataSet}>
          <Layer
            id={layerId}
            type="circle"
            paint={{
              'circle-color': [
                'case',
                ['boolean', ['get', 'selected'], false],
                '#fff', // Color for the selected feature
                '#FDE047', // Default color
              ],
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                8,
                4, // at zoom level 8, marker radius is 4
                12,
                8, // at zoom level 12, marker radius is 8
                16,
                12, // at zoom level 16, marker radius is 12
              ],
            }}
          />
        </Source>
      </Map>
      <button
        className="absolute bottom-[10%] right-[5%] bg-yellow-300 hover:bg-yellow-400 rounded-full h-16 w-16 flex justify-center items-center"
        onClick={handleSearchClick}
      >
        <MagnifyingGlassIcon className="h-8 w-8" />
      </button>
      <button
        className="absolute top-[10%] left-[25%] bg-white rounded-lg h-8 w-48 flex justify-center items-center"
        onClick={handleSearchThisArea}
      >
        <p>Search this area</p>
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
