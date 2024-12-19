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

  const MAP_CONSTANTS = {
    INITIAL_VIEW: {
      longitude: -79.99585,
      latitude: 40.440742,
      zoom: 12,
    },
    CIRCLE_PAINT: {
      SELECTED_COLOR: '#fff',
      DEFAULT_COLOR: '#FDE047',
      ZOOM_LEVELS: [
        { zoom: 8, radius: 4 },
        { zoom: 12, radius: 8 },
        { zoom: 16, radius: 12 },
      ],
    },
  } as const

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
      plausible('FeaturePointClick', {
        props: {
          shop: features[0].properties,
        },
      })
      plausible('FeaturePointClick', {
        props: {
          shopName: features[0].properties.name,
        },
      })
    }
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
    }
  }

  const handleNearbyShopClick = (shopFromShopPanel: TShop) => {
    handleUpdatingCurrentShop(shopFromShopPanel)
    document.getElementById('header')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Map
        mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
        initialViewState={MAP_CONSTANTS.INITIAL_VIEW}
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
                MAP_CONSTANTS.CIRCLE_PAINT.SELECTED_COLOR,
                MAP_CONSTANTS.CIRCLE_PAINT.DEFAULT_COLOR,
              ],
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                ...MAP_CONSTANTS.CIRCLE_PAINT.ZOOM_LEVELS.flatMap(({ zoom, radius }) => [zoom, radius]),
              ],
            }}
          />
        </Source>
      </Map>
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
