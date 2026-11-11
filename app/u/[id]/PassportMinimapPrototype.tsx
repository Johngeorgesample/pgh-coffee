'use client'
// PROTOTYPE: three passport minimap variants, switched via ?variant=A|B|C. Throwaway.

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Map, { Layer, Source } from 'react-map-gl'
import type { TFeatureCollection } from '@/types/shop-types'
import { openVisits, type Visit } from '@/app/utils/visitStats'
import PrototypeSwitcher from '@/app/components/PrototypeSwitcher'

const VARIANTS = [
  { key: 'A', name: 'Real map, passport mode' },
  { key: 'B', name: 'Mapbox static image' },
  { key: 'C', name: 'SVG dots, no basemap' },
]

const YELLOW = '#FDE047'
const MUTED = '#78716C'

function useAllShops() {
  const [shops, setShops] = useState<TFeatureCollection | null>(null)
  useEffect(() => {
    fetch('/api/shops/geojson').then((r) => r.json()).then(setShops)
  }, [])
  return shops
}

function visitedCoords(visits: Visit[]) {
  return openVisits(visits)
    .filter((v) => v.shop?.longitude && v.shop?.latitude)
    .map((v) => [v.shop.longitude!, v.shop.latitude!] as [number, number])
}

function bounds(coords: [number, number][]) {
  const lngs = coords.map((c) => c[0])
  const lats = coords.map((c) => c[1])
  return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)] as const
}

function VariantA({ visits }: { visits: Visit[] }) {
  const allShops = useAllShops()
  const visitedUUIDs = useMemo(() => new Set(openVisits(visits).map((v) => v.shop.uuid)), [visits])
  const coords = visitedCoords(visits)
  const data = useMemo(() => {
    if (!allShops) return null
    return {
      ...allShops,
      features: allShops.features.map((f) => ({
        ...f,
        properties: { visited: visitedUUIDs.has(f.properties.uuid) },
      })),
    }
  }, [allShops, visitedUUIDs])
  const [minLng, minLat, maxLng, maxLat] = coords.length ? bounds(coords) : [-80.1, 40.38, -79.9, 40.5]

  return (
    <div className="h-72 rounded-2xl overflow-hidden shadow-lg">
      <Map
        mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        initialViewState={{ bounds: [minLng, minLat, maxLng, maxLat], fitBoundsOptions: { padding: 40, maxZoom: 14 } }}
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

function VariantB({ profileId }: { profileId: string }) {
  return (
    <img
      className="w-full rounded-2xl shadow-lg"
      src={`/api/prototype/passport-static-map/${profileId}`}
      alt="Map of visited shops"
    />
  )
}

function VariantC({ visits }: { visits: Visit[] }) {
  const allShops = useAllShops()
  const visitedUUIDs = new Set(openVisits(visits).map((v) => v.shop.uuid))
  const shops = (allShops?.features ?? []).filter((f) => f.geometry.coordinates[0] !== 0)
  if (!shops.length) return <div className="h-72 rounded-2xl bg-gray-900" />

  const [minLng, minLat, maxLng, maxLat] = bounds(shops.map((f) => f.geometry.coordinates as [number, number]))
  // ponytail: equirectangular with a cos(lat) squash; fine at county scale
  const kx = Math.cos((40.44 * Math.PI) / 180)
  const w = (maxLng - minLng) * kx
  const h = maxLat - minLat
  const sorted = [...shops].sort((a, b) => Number(visitedUUIDs.has(a.properties.uuid)) - Number(visitedUUIDs.has(b.properties.uuid)))

  return (
    <div className="rounded-2xl bg-gray-900 shadow-lg p-4">
      <svg viewBox={`${-0.01} ${-0.01} ${w + 0.02} ${h + 0.02}`} className="w-full h-72">
        {sorted.map((f) => {
          const [lng, lat] = f.geometry.coordinates
          const visited = visitedUUIDs.has(f.properties.uuid)
          return (
            <circle
              key={f.properties.uuid}
              cx={(lng - minLng) * kx}
              cy={maxLat - lat}
              r={visited ? 0.004 : 0.0025}
              fill={visited ? YELLOW : MUTED}
              opacity={visited ? 1 : 0.45}
            >
              <title>{f.properties.name}</title>
            </circle>
          )
        })}
      </svg>
      <p className="mt-2 text-xs text-gray-400">
        {visitedUUIDs.size} of {shops.length} shops
      </p>
    </div>
  )
}

export default function PassportMinimapPrototype({ visits, profileId }: { visits: Visit[]; profileId: string }) {
  const variant = useSearchParams().get('variant') ?? 'A'
  return (
    <>
      {variant === 'A' && <VariantA visits={visits} />}
      {variant === 'B' && <VariantB profileId={profileId} />}
      {variant === 'C' && <VariantC visits={visits} />}
      <PrototypeSwitcher variants={VARIANTS} current={variant} />
    </>
  )
}
