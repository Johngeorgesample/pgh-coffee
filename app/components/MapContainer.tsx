'use client'

import { useRef, useEffect, useMemo } from 'react'
import Map, { Source, Layer, MapRef } from 'react-map-gl'
import { MapMouseEvent } from 'mapbox-gl'
import { useShopSelection } from '@/hooks'
import useShopsStore from '@/stores/coffeeShopsStore'

interface MapContainerProps {
  currentShopCoordinates: [number, number]
}

export default function MapContainer({ currentShopCoordinates }: MapContainerProps) {
  const { displayedShops, hoveredShop } = useShopsStore()
  const { handleShopSelect } = useShopSelection()
  const mapRef = useRef<MapRef | null>(null)
  const layerId = 'myPoint'
  const hoveredUUID = hoveredShop?.properties?.uuid || null

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

  const panToCurrentShop = () => {
    if (currentShopCoordinates?.every(element => Boolean(element))) {
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [currentShopCoordinates[0], currentShopCoordinates[1]],
          zoom: mapRef.current.getZoom(),
          bearing: 0,
          pitch: 0,
          duration: 1000,
          essential: true,
        })
      }
    }
  }

  useEffect(panToCurrentShop, [currentShopCoordinates])

  const shopsWithHoverState = useMemo(() => {
    if (!displayedShops?.features) return displayedShops

    return {
      ...displayedShops,
      features: displayedShops.features.map(shop => ({
        ...shop,
        properties: {
          ...shop.properties,
          hovered: hoveredUUID === shop.properties.uuid,
        },
      })),
    }
  }, [displayedShops, hoveredUUID])

  const handleMapClick = (event: MapMouseEvent) => {
    const map = mapRef.current?.getMap()
    const features = map?.queryRenderedFeatures(event.point, {
      layers: [layerId],
    }) as unknown as GeoJSON.Feature[] | undefined

    if (features?.length && features[0].properties) {
      // queryRenderedFeatures strips nested objects like 'company'
      // Look up the full shop data from the store using uuid
      const clickedUuid = features[0].properties.uuid
      const fullShop = displayedShops.features.find(
        shop => shop.properties.uuid === clickedUuid
      )

      if (fullShop) {
        handleShopSelect(fullShop)
      }
    }
  }

  return (
    <div data-testid="map-container" className="w-full lg:w-2/3">
      <Map
        mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
        initialViewState={MAP_CONSTANTS.INITIAL_VIEW}
        cursor="pointer"
        mapStyle="mapbox://styles/mapbox/dark-v11"
        onClick={handleMapClick}
        ref={mapRef}
      >
        <Source id="my-data" type="geojson" data={shopsWithHoverState}>
          {/* White border layer */}
          <Layer
            id="shop-border"
            type="circle"
            paint={{
              'circle-color': [
                'case',
                ['boolean', ['get', 'hovered'], false],
                '#ffffff', // white border for hovered
                ['boolean', ['get', 'selected'], false],
                '#ffffff', // white border for selected
                'transparent', // fallback (no border)
              ],
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                ...MAP_CONSTANTS.CIRCLE_PAINT.ZOOM_LEVELS.flatMap(({ zoom, radius }) => [zoom, radius + 2]), // +2 for border
              ],
            }}
          />

          {/* Yellow dot layer */}
          <Layer
            id={layerId}
            type="circle"
            paint={{
              'circle-color': [
                'case',
                ['boolean', ['get', 'hovered'], false],
                '#FDE047', // or another hover color if you choose
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
    </div>
  )
}
