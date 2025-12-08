import { useRef, useEffect, useState, useCallback } from 'react'
import Map, { Source, Layer, MapRef } from 'react-map-gl'
import { MapMouseEvent } from 'mapbox-gl'
import { TShop } from '@/types/shop-types'

interface MapContainerProps {
  dataSet: { type: string; features: TShop[] }
  currentShopCoordinates: [number, number]
  onShopSelect: (properties: Record<string, any>, geometry: Record<string, any>, type: string) => void
}

const MAP_CONSTANTS = {
  INITIAL_VIEW: { longitude: -79.99585, latitude: 40.440742, zoom: 12 },
  CIRCLE_PAINT: {
    SELECTED_COLOR: '#fff',
    DEFAULT_COLOR: '#FDE047',
    USER_LOCATION_COLOR: '#3B82F6',
    ZOOM_LEVELS: [
      { zoom: 8, radius: 4 },
      { zoom: 12, radius: 8 },
      { zoom: 16, radius: 12 },
    ],
  },
} as const

export default function MapContainer({ dataSet, currentShopCoordinates, onShopSelect }: MapContainerProps) {
  const [userLocation, setUserLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  const [viewState, setViewState] = useState(MAP_CONSTANTS.INITIAL_VIEW)
  const mapRef = useRef<MapRef | null>(null)

  const panToCurrentShop = useCallback(() => {
    if (mapRef.current && currentShopCoordinates?.every(n => typeof n === 'number')) {
      mapRef.current.flyTo({
        center: [currentShopCoordinates[0], currentShopCoordinates[1]],
        zoom: mapRef.current.getZoom(),
        duration: 1000,
        essential: true,
      })
    }
  }, [currentShopCoordinates])

  useEffect(panToCurrentShop, [panToCurrentShop])

  const handleMapClick = (e: MapMouseEvent) => {
    const map = mapRef.current?.getMap()
    const features = map?.queryRenderedFeatures(e.point, {
      layers: ['shops'],
    }) as GeoJSON.Feature[] | undefined

    if (features?.length && features[0].properties) {
      const { properties, geometry, type } = features[0]
      onShopSelect(properties, geometry, type)
    }
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setUserLocation({ latitude: coords.latitude, longitude: coords.longitude }),
      console.error,
    )
  }, [])

  useEffect(() => {
    if (userLocation) {
      setViewState({
        longitude: userLocation.longitude,
        latitude: userLocation.latitude,
        zoom: 12,
      })
    }
  }, [userLocation])

  const userFeatureCollection = userLocation && {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [userLocation.longitude, userLocation.latitude],
        },
      },
    ],
  }

  const radiusStops = MAP_CONSTANTS.CIRCLE_PAINT.ZOOM_LEVELS.flatMap(({ zoom, radius }) => [zoom, radius])

  return (
    <div data-testid="map-container" className="h-full w-full">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        cursor="pointer"
        onClick={handleMapClick}
        ref={mapRef}
      >
        <Source id="shops-data" type="geojson" data={dataSet}>
          <Layer
            id="shops"
            type="circle"
            paint={{
              'circle-color': [
                'case',
                ['boolean', ['get', 'selected'], false],
                MAP_CONSTANTS.CIRCLE_PAINT.SELECTED_COLOR,
                MAP_CONSTANTS.CIRCLE_PAINT.DEFAULT_COLOR,
              ],
              'circle-radius': ['interpolate', ['linear'], ['zoom'], ...radiusStops],
            }}
          />
        </Source>

        {userFeatureCollection && (
          <Source id="user-data" type="geojson" data={userFeatureCollection}>
            <Layer
              id="user-location"
              type="circle"
              paint={{
                'circle-color': MAP_CONSTANTS.CIRCLE_PAINT.USER_LOCATION_COLOR,
                'circle-radius': ['interpolate', ['linear'], ['zoom'], ...radiusStops],
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  )
}
