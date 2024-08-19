'use client'
import { useCallback, useRef } from 'react'
import Footer from '@/app/components/Footer'
import type { FeatureCollection } from 'geojson'
import Map, { Source, Layer } from 'react-map-gl'

export default function Mappy() {
  const mapRef = useRef(null)
  const geojson: FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-79.97357483740181, 40.45710759784333],
        },
        properties: {
          title: 'Niche.com',
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-79.96497154370446, 40.46603536017457],
        },
        properties: {
          title: 'Espresso a Mano',
        },
      },
    ],
  }

  const layerId = 'myPoint'

  const handleMapClick = event => {
    const map = mapRef.current.getMap()
    const features = map.queryRenderedFeatures(event.point, {
      layers: [layerId],
    })

    if (features.length) {
      console.log(features[0].properties.title)
    }
  }

  return (
    <>
      <main className="flex min-h-[calc(100vh-72px)] flex-col items-center">
        <div className="flex justify-center items-center flex-col absolute top-0 h-56">
          <h1>map</h1>
        </div>
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
          <Source id="my-data" type="geojson" data={geojson}>
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
    </>
  )
}
