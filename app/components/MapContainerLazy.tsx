'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Code-split MapContainer (and the heavy mapbox-gl/react-map-gl payload it pulls
// in) out of the initial bundle. ssr: false because the map is client-only.
const MapContainer = dynamic(() => import('./MapContainer'), {
  ssr: false,
  loading: () => <MapPlaceholder />,
})

// Matches MapContainer's outer layout exactly so deferring the mount doesn't
// shift the panel or cause a layout jump (CLS). Dark fill mirrors the
// mapbox dark-v11 style so the swap-in is visually seamless.
function MapPlaceholder() {
  return (
    <div
      data-testid="map-placeholder"
      aria-hidden="true"
      className="w-full lg:w-2/3 overflow-hidden bg-[#191a1a] animate-pulse"
    />
  )
}

interface MapContainerLazyProps {
  currentShopCoordinates: [number, number]
}

/**
 * Defers mounting the map until after the first paint so mapbox-gl's parse +
 * init cost (~2.8s of main-thread blocking) lands outside the critical
 * render path. The panel and explore content paint first; the map mounts on
 * the first idle callback (or a short timeout fallback on browsers without
 * requestIdleCallback).
 */
export default function MapContainerLazy(props: MapContainerLazyProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const ric = window.requestIdleCallback
    if (typeof ric === 'function') {
      const handle = ric(() => setReady(true), { timeout: 2000 })
      return () => window.cancelIdleCallback?.(handle)
    }
    const timer = window.setTimeout(() => setReady(true), 200)
    return () => window.clearTimeout(timer)
  }, [])

  if (!ready) return <MapPlaceholder />

  return <MapContainer {...props} />
}
