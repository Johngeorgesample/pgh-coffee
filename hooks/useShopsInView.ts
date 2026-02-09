import { useMemo, useState, useCallback } from 'react'
import { LngLatBounds } from 'mapbox-gl'
import type { TShop } from '@/types/shop-types'

export function useShopsInView(shops: TShop[], enabled: boolean) {
  const [bounds, setBounds] = useState<LngLatBounds | null>(null)

  const shopsInView = useMemo(() => {
    if (!enabled || !bounds) return []
    return shops.filter(shop => {
      const [lng, lat] = shop.geometry.coordinates
      return bounds.contains([lng, lat])
    })
  }, [enabled, bounds, shops])

  const updateBounds = useCallback((e: { target: { getBounds: () => LngLatBounds | null } }) => {
    const newBounds = e.target.getBounds()
    if (newBounds) setBounds(newBounds)
  }, [])

  return { shopsInView, updateBounds }
}
