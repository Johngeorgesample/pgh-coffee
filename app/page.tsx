'use client'

import { useRef, useEffect, useState } from 'react'
import Map, { Source, Layer } from 'react-map-gl'
import Footer from '@/app/components/Footer'
import { TShop } from '@/types/shop-types'
import Header2 from '@/app/components/Header2'
import ShopPanel from '@/app/components/ShopPanel'
import shopGeoJSON from '@/data/coffee_shops_geojson.json'

export default function Mappy() {
  let [isOpen, setIsOpen] = useState(false)
  let [currentShop, setCurrentShop] = useState({} as TShop)
  let [dataSet, setDataSet] = useState(shopGeoJSON)

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
    }
  }

  useEffect(() => {
    const newData = {
      ...dataSet,
      features: dataSet.features.map(f => {
        const isSelected =
          f.properties.address === currentShop.properties?.address
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
  }, [currentShop, dataSet])

  // slowly pan to currentShop (not centered)
  useEffect(() => {
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
  }, [currentShop])

  const handleClose = () => {
    setIsOpen(false)
    setDataSet(shopGeoJSON)
  }

  const woohoo = (shopFromShopPanel: any) => {
    setCurrentShop(shopFromShopPanel)
    document.getElementById('ball')?.scrollIntoView({ behavior: 'smooth' })

  }

  return (
    <>
      <main>
        <Header2 />
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
              id='myPoint'
              type='circle'
              paint={{
                'circle-color': [
                  'case',
                  ['boolean', ['get', 'selected'], false],
                  'white', // Color for the selected feature
                  '#FDE047', // Default color
                ],
                'circle-radius': 8,
              }}
            />
          </Source>
        </Map>
      </main>
      <Footer />
      <ShopPanel foobar={woohoo} shop={currentShop} panelIsOpen={isOpen} emitClose={handleClose} />
    </>
  )
}
