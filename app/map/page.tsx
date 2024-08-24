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
  let [currentShop, setCurrentShop] = useState({})
  let [currentFeature, setCurrentFeature] = useState({})
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
      setCurrentFeature(features[0])
    }
  }

  useEffect(() => {
    const newData = {
      ...dataSet,
      features: dataSet.features.map(f => {
        const isSelected =
          f.properties.address === currentShop.properties.address
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

  // slowly pan to currentFeature (not centered)
  useEffect(() => {
    if (mapRef.current && currentFeature) {
      // @ts-ignore-next-line
      mapRef.current.flyTo({
        // @ts-ignore-next-line
        center: [currentFeature.geometry.coordinates[0], currentFeature.geometry.coordinates[1]],
        // @ts-ignore-next-line
        zoom: mapRef.current?.getZoom(),
        bearing: 0,
        pitch: 0,
        duration: 1000,
        essential: true,
      })
    }
  }, [currentFeature])

  const handleClose = () => {
    setIsOpen(false)
  }

  const woohoo = (shopFromShopPanel: any) => {
    setCurrentFeature(shopFromShopPanel)
    setCurrentShop(shopFromShopPanel)
    document.getElementById('ball')?.scrollIntoView({ behavior: 'smooth' })

  }

  const layerStyle = {
    id: 'myPoint',
    type: 'circle',
    paint: {
      'circle-color': [
        'case',
        ['boolean', ['get', 'selected'], false],
        'white', // Color for the selected feature
        '#FDE047', // Default color
      ],
      'circle-radius': 8,
    },
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
            <Layer {...layerStyle} />
          </Source>
        </Map>
      </main>
      <Footer />
      <ShopPanel foobar={woohoo} shop={currentShop} panelIsOpen={isOpen} emitClose={handleClose} />
    </>
  )
}
