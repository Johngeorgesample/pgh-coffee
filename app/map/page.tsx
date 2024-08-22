'use client'

import { useRef, useEffect, useState } from 'react'
import Map, { Source, Layer } from 'react-map-gl'
import Footer from '@/app/components/Footer'
import { TShop } from '@/types/shop-types'
import Header from '@/app/components/Header'
import ShopPanel from '@/app/components/ShopPanel'
import shopGeoJSON from '@/data/coffee_shops_geojson.json'

export default function Mappy() {
  let [isOpen, setIsOpen] = useState(false)
  let [currentShop, setCurrentShop] = useState({} as TShop)
  let [currentFeature, setCurrentFeature] = useState({})

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
      setCurrentShop(features[0].properties)
      setCurrentFeature(features[0])
      // https://stackoverflow.com/questions/60838755/how-to-center-marker-on-mapbox-gl-js-map-on-click
    }
  }

  // centers map on currentFeature
  // useEffect(() => {
  //   if (mapRef.current && currentFeature) {
  //       console.log(mapRef.current)
  //       mapRef.current?.setCenter({
  //         lat: currentFeature.geometry.coordinates[1],
  //         lng: currentFeature.geometry.coordinates[0],
  //       })
  //   }
  // }, [currentFeature])


  // slowly pan to currentFeature (not centered)
  useEffect(() => {
    if (mapRef.current && currentFeature) {
        const target = {
            center: [currentFeature.geometry.coordinates[0], currentFeature.geometry.coordinates[1]],
            zoom: mapRef.current?.getZoom(),
            bearing: 0,
            pitch: 0
        }

        mapRef.current?.flyTo({
          ...target,
          duration: 1000,
          essential: true
        })
    }
  }, [currentFeature])

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <main>
        <Header />
        <Map
          mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
          initialViewState={{
            longitude: -79.99585,
            latitude: 40.440742,
            zoom: 12,
          }}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          onClick={handleMapClick}
          ref={mapRef}
        >
          <Source id="my-data" type="geojson" data={shopGeoJSON}>
            <Layer
              id={layerId}
              type="circle"
              paint={{
                'circle-radius': 10,
                // 'circle-color': '#007cbf',
                'circle-color': '#FDE047',
              }}
            />
          </Source>
        </Map>
      </main>
      <Footer />
      <ShopPanel shop={currentShop} panelIsOpen={isOpen} emitClose={handleClose} />
    </>
  )
}
