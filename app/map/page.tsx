'use client'
import { useRef, useState } from 'react'
import Footer from '@/app/components/Footer'
import Toggle from '@/app/components/Toggle'
import Map, { Source, Layer } from 'react-map-gl'
import { TShop } from '@/types/shop-types'
import ShopPanel from '@/app/components/ShopPanel'

import shopGeoJSON from '../../data/coffee_shops_geojson'

export default function Mappy() {
  let [isOpen, setIsOpen] = useState(false)
  let [currentShop, setCurrentShop] = useState({} as TShop)
  const mapRef = useRef(null)
  const layerId = 'myPoint'

  const handleMapClick = event => {
    const map = mapRef.current?.getMap()
    const features = map.queryRenderedFeatures(event.point, {
      layers: [layerId],
    })

    if (features.length) {
      console.log(features[0].properties)
      setIsOpen(true)
      setCurrentShop(features[0].properties)
    }
  }


  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <main className="flex min-h-[calc(100vh-72px)] flex-col items-center">
        <div className="flex justify-center items-center flex-col absolute top-0 h-56">
          <h1>map</h1>
        </div>

        <Toggle />
        <Map
          mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
          initialViewState={{
            longitude: -79.99585,
            latitude: 40.440742,
            zoom: 12,
          }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          onClick={handleMapClick}
          ref={mapRef} // add this
        >
          <Source id="my-data" type="geojson" data={shopGeoJSON}>
            <Layer
              id={layerId}
              type="circle"
              paint={{
                'circle-radius': 10,
                'circle-color': '#007cbf',
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
