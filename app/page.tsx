'use client'

import { useRef, useEffect, useState } from 'react'
import { usePlausible } from 'next-plausible'
import Map, { Source, Layer } from 'react-map-gl'
import Footer from '@/app/components/Footer'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { TShop } from '@/types/shop-types'
import ShopPanel from '@/app/components/ShopPanel'
import shopGeoJSON from '@/data/coffee_shops.json'
import { DISTANCE_UNITS } from './settings/DistanceUnitsDialog'

export default function Mappy() {
  const plausible = usePlausible()
  const [isOpen, setIsOpen] = useState(false)
  const [currentShop, setCurrentShop] = useState({} as TShop)
  const [dataSet, setDataSet] = useState(shopGeoJSON as any)

  const mapRef = useRef(null)
  const layerId = 'myPoint'

  const handleMapClick = (event: any) => {
    // @ts-ignore-next-line
    const map = mapRef.current?.getMap()
    const features = map.queryRenderedFeatures(event.point, {
      layers: [layerId],
    })

    if (features.length) {
      setIsOpen(true)
      setCurrentShop(features[0])
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
    setDataSet(shopGeoJSON)
  }

  const handleSearchClick = () => {
    setCurrentShop({} as TShop)
    setIsOpen(true)
  }

  const handleFilterChange = (e: any) => {
    const filteredResults = dataSet.features.filter((d: any) => {
      return d.properties.name.toLowerCase().includes(e.toLowerCase())
    })
    console.log(filteredResults)
    setDataSet({ ...dataSet, features: filteredResults })
  }

  const handleNearbyShopClick = (shopFromShopPanel: TShop) => {
    setCurrentShop(shopFromShopPanel)
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
              'circle-radius': 8,
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
      <Footer />
      <ShopPanel
        handlePanelContentClick={handleNearbyShopClick}
        shop={currentShop}
        panelIsOpen={isOpen}
        emitClose={handleClose}
      />
    </>
  )
}
