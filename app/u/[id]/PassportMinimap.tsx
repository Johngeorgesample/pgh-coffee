'use client'

import { useEffect, useMemo, useState } from 'react'
import Map, { Layer, Source } from 'react-map-gl'
import type { TFeatureCollection } from '@/types/shop-types'
import { openVisits, type Visit } from '@/app/utils/visitStats'

const YELLOW = '#FDE047'
const MUTED = '#78716C'

function useAllShops() {
  const [shops, setShops] = useState<TFeatureCollection | null>(null)
  useEffect(() => {
    fetch('/api/shops/geojson').then((r) => r.json()).then(setShops)
  }, [])
  return shops
}

function visitedShops(visits: Visit[]) {
  return openVisits(visits).filter((v) => v.shop?.longitude && v.shop?.latitude)
}

function boundsOf(visits: Visit[]) {
  const lngs = visits.map((v) => v.shop.longitude!)
  const lats = visits.map((v) => v.shop.latitude!)
  return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)] as [number, number, number, number]
}

function markVisited(allShops: TFeatureCollection, visitedUUIDs: Set<string>) {
  return {
    ...allShops,
    features: allShops.features.map((f) => ({
      ...f,
      properties: { visited: visitedUUIDs.has(f.properties.uuid) },
    })),
  }
}

export default function PassportMinimap({ visits }: { visits: Visit[] }) {
  const allShops = useAllShops()
  const visited = useMemo(() => visitedShops(visits), [visits])
  const data = useMemo(
    () => allShops && markVisited(allShops, new Set(visited.map((v) => v.shop.uuid))),
    [allShops, visited],
  )

  if (visited.length === 0) return null

  return (
    <div className="h-72 rounded-2xl overflow-hidden shadow-lg">
      <Map
        mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        initialViewState={{ bounds: boundsOf(visited), fitBoundsOptions: { padding: 40, maxZoom: 14 } }}
        scrollZoom={false}
        dragRotate={false}
        attributionControl={false}
      >
        {data && (
          <Source id="passport" type="geojson" data={data}>
            <Layer
              id="glow"
              type="circle"
              paint={{
                'circle-color': YELLOW,
                'circle-blur': 1,
                'circle-radius': 14,
                'circle-opacity': ['case', ['get', 'visited'], 0.3, 0],
              }}
            />
            <Layer
              id="dot"
              type="circle"
              paint={{
                'circle-color': ['case', ['get', 'visited'], YELLOW, MUTED],
                'circle-opacity': ['case', ['get', 'visited'], 1, 0.45],
                'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 3, 12, 6, 16, 10],
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  )
}
