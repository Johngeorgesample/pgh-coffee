'use client'

import { useEffect, useState } from 'react'
import ShopCard from '../ShopCard'
import { TShop } from '@/types/shop-types'

export default function FeaturedShop() {
  const [shop, setShop] = useState<TShop | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/featured-shop', { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: TShop = await res.json()
        if (!cancelled) setShop(data)
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? 'Failed to load featured shop')
      }
    }

    fetchFeatured()
    return () => {
      cancelled = true
    }
  }, [])

  if (err) return null
  if (!shop) return null

  return (
    <div className="sm:col-span-2">
      <h3 className="flex-1 text-xs font-semibold uppercase tracking-wider text-stone-500">Featured shop</h3>
      <div className="list-none">
        <ShopCard featured shop={shop} />
      </div>
    </div>
  )
}
