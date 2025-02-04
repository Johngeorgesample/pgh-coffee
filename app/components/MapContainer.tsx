import { useRef, useEffect } from 'react'
import Map, { Source, Layer, MapRef } from 'react-map-gl'
import { MapMouseEvent } from 'mapbox-gl'
import { TShop } from '@/types/shop-types'

interface MapContainerProps {
  dataSet: {
    type: string
    features: TShop[]
  }
  currentShop: TShop
  currentShopAddress: string | undefined
  onShopSelect: (properties: Record<string, any>, geometry: Record<string, any>, type: string) => void
}

export default function MapContainer({ dataSet, currentShop, onShopSelect }: MapContainerProps) {
  const mapRef = useRef<MapRef | null>(null)
  const layerId = 'myPoint'

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

  // Pan to currentShop
  useEffect(() => {
    if (currentShop?.properties && currentShop?.geometry?.coordinates) {
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [currentShop.geometry.coordinates[0], currentShop.geometry.coordinates[1]],
          zoom: mapRef.current.getZoom(),
          bearing: 0,
          pitch: 0,
          duration: 1000,
          essential: true,
        })
      }
    }
  }, [currentShop])

  const handleMapClick = (event: MapMouseEvent) => {
    const map = mapRef.current?.getMap()
    const features = map?.queryRenderedFeatures(event.point, {
      layers: [layerId],
    }) as unknown as GeoJSON.Feature[] | undefined

    if (features?.length && features[0].properties) {
      onShopSelect(features[0].properties, features[0].geometry, features[0].type)
    }
  }

  return (
    <Map
      mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
      initialViewState={MAP_CONSTANTS.INITIAL_VIEW}
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
  )
}
