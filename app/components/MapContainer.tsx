'use client'

import { useRef, useEffect, useMemo, useState, useCallback } from 'react'
import Map, { Source, Layer, MapRef, Popup } from 'react-map-gl'
import { MapMouseEvent } from 'mapbox-gl'
import type { MapLayerMouseEvent } from 'react-map-gl'
import { useShopSelection } from '@/hooks'
import useShopsStore from '@/stores/coffeeShopsStore'

interface MapContainerProps {
  currentShopCoordinates: [number, number]
}

export default function MapContainer({ currentShopCoordinates }: MapContainerProps) {
  const { displayedShops, hoveredShop, currentShop } = useShopsStore()
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

  const handleMouseMove = useCallback(
    (event: MapLayerMouseEvent) => {
      const map = mapRef.current?.getMap()
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
    [currentShop?.properties?.uuid, displayedShops.features],
  )

  const handleMouseLeave = useCallback(() => {
    setPopupInfo(null)
  }, [])

  const handleMapClick = (event: MapMouseEvent) => {
    setPopupInfo(null)
    const map = mapRef.current?.getMap()
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
    <div data-testid="map-container" className="w-full lg:w-2/3 overflow-hidden">
      <Map
        mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
        initialViewState={MAP_CONSTANTS.INITIAL_VIEW}
        cursor="pointer"
        mapStyle="mapbox://styles/mapbox/dark-v11"
        onClick={handleMapClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onZoom={(e) => setZoomLevel(e.viewState.zoom)}
        interactiveLayerIds={[layerId]}
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


        {showAllPopups &&
          displayedShops.features
            .filter(shop =>
              shop.properties.uuid !== currentShop?.properties?.uuid &&
              shop.properties.uuid !== popupInfo?.uuid
            )
            .map(shop => (
              <Popup
                key={shop.properties.uuid}
                longitude={shop.geometry.coordinates[0]}
                latitude={shop.geometry.coordinates[1]}
                anchor="bottom"
                offset={[0, -14] as [number, number]}
                closeButton={false}
                closeOnClick={false}
                className="shop-hover-popup"
              >
                <div className="w-48 h-28 relative rounded-lg overflow-hidden">
                  {shop.properties.photo ? (
                    <img className="h-full w-full object-cover object-center" src={shop.properties.photo} alt={shop.properties.name} />
                  ) : (
                    <div className="h-full w-full bg-yellow-200" />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.7),transparent_100%)]" />
                  <div className="absolute bottom-0 w-full px-2 py-1">
                    <p className="font-medium text-white text-sm leading-tight">{shop.properties.name}</p>
                    <p className="text-white/80 text-xs mt-0.5">{shop.properties.neighborhood}</p>
                  </div>
                </div>
              </Popup>
            ))}

        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            anchor="bottom"
            offset={[0, -14] as [number, number]}
            closeButton={false}
            closeOnClick={false}
            className="shop-hover-popup"
          >
            <div className="w-48 h-28 relative rounded-lg overflow-hidden">
              {popupInfo.photo ? (
                <img className="h-full w-full object-cover object-center" src={popupInfo.photo} alt={popupInfo.name} />
              ) : (
                <div className="h-full w-full bg-yellow-200" />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.7),transparent_100%)]" />
              <div className="absolute bottom-0 w-full px-2 py-1">
                <p className="font-medium text-white text-sm leading-tight">{popupInfo.name}</p>
                <p className="text-white/80 text-xs mt-0.5">{popupInfo.neighborhood}</p>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}
