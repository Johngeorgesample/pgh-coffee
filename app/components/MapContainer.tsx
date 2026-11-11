'use client'

import { useRef, useEffect, useMemo, useState, useCallback } from 'react'
import Map, { Source, Layer, MapRef } from 'react-map-gl'
import { MapMouseEvent } from 'mapbox-gl'
import type { MapLayerMouseEvent } from 'react-map-gl'
import { useShopSelection, useShopsInView } from '@/hooks'
import useShopsStore, { useDisplayedShops, useIsClosed } from '@/stores/coffeeShopsStore'
import ShopPopup from './ShopPopup'
import PassportToggle from './PassportToggle'
import { getFeatureBounds } from '@/app/utils/utils'
import { nearestShops } from '@/app/utils/shopsByDistance'

interface MapContainerProps {
  currentShopCoordinates: [number, number]
}

export default function MapContainer({ currentShopCoordinates }: MapContainerProps) {
  const displayedShops = useDisplayedShops()
  const hoveredShop = useShopsStore(s => s.hoveredShop)
  const currentShop = useShopsStore(s => s.currentShop)
  const overrideShops = useShopsStore(s => s.overrideShops)
  const nearPoint = useShopsStore(s => s.nearPoint)
  const allShops = useShopsStore(s => s.allShops)
  const visitedUUIDs = useShopsStore(s => s.visitedUUIDs)
  const passportMode = useShopsStore(s => s.passportMode)
  const isClosed = useIsClosed()
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
      MUTED_COLOR: '#78716C',
      MUTED_OPACITY: 0.45,
      VISITED_GLOW_OPACITY: 0.3,
      ZOOM_LEVELS: [
        { zoom: 8, radius: 4 },
        { zoom: 12, radius: 8 },
        { zoom: 16, radius: 12 },
      ],
    },
  } as const

  const [popupInfo, setPopupInfo] = useState<{
    longitude: number
    latitude: number
    name: string
    neighborhood: string
    photo: string | null
    uuid: string
  } | null>(null)

  const [zoomLevel, setZoomLevel] = useState<number>(MAP_CONSTANTS.INITIAL_VIEW.zoom)

  const showAllPopups = zoomLevel > 15

  const { shopsInView, updateBounds } = useShopsInView(displayedShops.features, showAllPopups)

  // Depend on the coordinates themselves, not the array: callers build a fresh
  // literal every render, which otherwise re-ran the 1s flyTo on unrelated state
  // changes (typing in search) and yanked the map back off wherever it was.
  const [currentLongitude, currentLatitude] = currentShopCoordinates ?? []

  const panToCurrentShop = () => {
    if (!currentLongitude || !currentLatitude || !mapRef.current) return

    mapRef.current.flyTo({
      center: [currentLongitude, currentLatitude],
      zoom: mapRef.current.getZoom(),
      bearing: 0,
      pitch: 0,
      duration: 1000,
      essential: true,
    })
  }

  useEffect(panToCurrentShop, [currentLongitude, currentLatitude])

  const fitToOverrideShops = () => {
    if (!overrideShops?.features.length || !mapRef.current) return
    mapRef.current.fitBounds([...getFeatureBounds(overrideShops.features)], { padding: 80, maxZoom: 15, duration: 1000 })
  }

  useEffect(fitToOverrideShops, [overrideShops])

  const fitToNearPoint = () => {
    if (!nearPoint || !mapRef.current) return
    const closest = nearestShops(allShops?.features ?? [], nearPoint).map(n => n.shop)
    const [west, south, east, north] = getFeatureBounds(closest)
    const [lng, lat] = nearPoint
    mapRef.current.fitBounds(
      [Math.min(west, lng), Math.min(south, lat), Math.max(east, lng), Math.max(north, lat)],
      { padding: 80, maxZoom: 15, duration: 1000 },
    )
  }

  useEffect(fitToNearPoint, [nearPoint, allShops])

  const shopsWithHoverState = useMemo(() => {
    if (!displayedShops?.features) return displayedShops

    return {
      ...displayedShops,
      features: displayedShops.features.map(shop => {
        const visited = passportMode && !!visitedUUIDs?.has(shop.properties.uuid)
        return {
          ...shop,
          properties: {
            ...shop.properties,
            hovered: hoveredUUID === shop.properties.uuid,
            visited,
            muted: (passportMode && !visited) || isClosed(shop.properties.uuid),
          },
        }
      }),
    }
  }, [displayedShops, hoveredUUID, passportMode, visitedUUIDs, isClosed])

  const handleMouseMove = useCallback(
    (event: MapLayerMouseEvent) => {
      if (showAllPopups) return

      const map = mapRef.current?.getMap()
      if (!map?.getLayer(layerId)) return
      const features = map?.queryRenderedFeatures(event.point, {
        layers: [layerId],
      }) as unknown as GeoJSON.Feature[] | undefined

      if (!features?.length || !features[0].properties) {
        setPopupInfo(null)
        return
      }

      const hoveredShopUUID = features[0].properties.uuid

      if (currentShop?.properties?.uuid === hoveredShopUUID) {
        setPopupInfo(null)
        return
      }

      const hydratedHoveredShop = displayedShops.features.find(shop => shop.properties.uuid === hoveredShopUUID)

      if (hydratedHoveredShop) {
        setPopupInfo({
          longitude: hydratedHoveredShop.geometry.coordinates[0],
          latitude: hydratedHoveredShop.geometry.coordinates[1],
          name: hydratedHoveredShop.properties.name,
          neighborhood: hydratedHoveredShop.properties.neighborhood,
          photo: hydratedHoveredShop.properties.photo || null,
          uuid: hydratedHoveredShop.properties.uuid,
        })
      }
    },
    [currentShop?.properties?.uuid, displayedShops.features, showAllPopups],
  )

  const handleMouseLeave = useCallback(() => {
    setPopupInfo(null)
  }, [])

  const handleMapClick = (event: MapMouseEvent) => {
    setPopupInfo(null)
    const map = mapRef.current?.getMap()
    if (!map?.getLayer(layerId)) return
    const features = map?.queryRenderedFeatures(event.point, {
      layers: [layerId],
    }) as unknown as GeoJSON.Feature[] | undefined

    if (features?.length && features[0].properties) {
      // queryRenderedFeatures strips nested objects like 'company'
      // Look up the full shop data from the store using uuid
      const clickedUUID = features[0].properties.uuid
      const hydratedClickedShop = displayedShops.features.find(shop => shop.properties.uuid === clickedUUID)

      if (hydratedClickedShop) {
        handleShopSelect(hydratedClickedShop)
      }
    }
  }

  return (
    <div data-testid="map-container" className="relative w-full lg:w-2/3 overflow-hidden">
      <PassportToggle />
      <Map
        mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
        initialViewState={MAP_CONSTANTS.INITIAL_VIEW}
        cursor="pointer"
        mapStyle="mapbox://styles/mapbox/dark-v11"
        onClick={handleMapClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onLoad={(e) => {
          updateBounds(e)
          // The ref is still null when the first pan effect runs on a direct shop URL
          panToCurrentShop()
          fitToOverrideShops()
          fitToNearPoint()
        }}
        onZoomEnd={(e) => setZoomLevel(e.viewState.zoom)}
        onMoveEnd={updateBounds}
        interactiveLayerIds={[layerId]}
        ref={mapRef}
      >
        <Source id="my-data" type="geojson" data={shopsWithHoverState}>
          <Layer
            id="visited-glow"
            type="circle"
            paint={{
              'circle-color': MAP_CONSTANTS.CIRCLE_PAINT.DEFAULT_COLOR,
              'circle-blur': 1,
              'circle-opacity': [
                'case',
                ['boolean', ['get', 'visited'], false],
                MAP_CONSTANTS.CIRCLE_PAINT.VISITED_GLOW_OPACITY,
                0,
              ],
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                ...MAP_CONSTANTS.CIRCLE_PAINT.ZOOM_LEVELS.flatMap(({ zoom, radius }) => [zoom, radius + 8]),
              ],
            }}
          />

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
                ['boolean', ['get', 'muted'], false],
                MAP_CONSTANTS.CIRCLE_PAINT.MUTED_COLOR,
                MAP_CONSTANTS.CIRCLE_PAINT.DEFAULT_COLOR,
              ],
              'circle-opacity': [
                'case',
                ['boolean', ['get', 'hovered'], false],
                1,
                ['boolean', ['get', 'selected'], false],
                1,
                ['boolean', ['get', 'muted'], false],
                MAP_CONSTANTS.CIRCLE_PAINT.MUTED_OPACITY,
                1,
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

        {nearPoint && (
          <Source id="near-point" type="geojson" data={{ type: 'Point', coordinates: nearPoint }}>
            <Layer
              id="near-point"
              type="circle"
              paint={{ 'circle-color': '#3B82F6', 'circle-radius': 8, 'circle-stroke-color': '#fff', 'circle-stroke-width': 3 }}
            />
          </Source>
        )}

        {showAllPopups &&
          shopsInView
            .filter(shop =>
              shop.properties.uuid !== currentShop?.properties?.uuid
            )
            .map(shop => (
              <ShopPopup
                key={shop.properties.uuid}
                longitude={shop.geometry.coordinates[0]}
                latitude={shop.geometry.coordinates[1]}
                name={shop.properties.name}
                neighborhood={shop.properties.neighborhood}
                photo={shop.properties.photo || null}
                onClick={() => handleShopSelect(shop)}
              />
            ))}

        {popupInfo && !showAllPopups && (
          <ShopPopup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            name={popupInfo.name}
            neighborhood={popupInfo.neighborhood}
            photo={popupInfo.photo}
            onClick={() => {
              const shop = displayedShops.features.find(s => s.properties.uuid === popupInfo.uuid)
              if (shop) handleShopSelect(shop)
            }}
          />
        )}
      </Map>
    </div>
  )
}
