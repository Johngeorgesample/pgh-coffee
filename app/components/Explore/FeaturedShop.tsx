'use client'

import { useEffect } from 'react'
import ShopCard from '../ShopCard'
import useExploreStore from '@/stores/exploreStore'

const FeaturedShopSkeleton = () => (
  <div className="sm:col-span-2">
    <h3 className="flex-1 text-xs font-semibold uppercase tracking-wider text-stone-500">Featured shop</h3>
    <div className="list-none mt-3">
      <div className="h-46 relative mb-4 rounded-sm overflow-hidden shadow-md bg-stone-200 animate-pulse">
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.3),transparent_100%)]" />
        <div className="px-2 py-1 absolute bottom-0 w-full">
          <div className="h-7 w-2/3 bg-stone-300 rounded mb-2" />
          <div className="flex items-center gap-1 mb-1">
            <div className="h-4 w-4 bg-stone-300 rounded" />
            <div className="h-4 w-24 bg-stone-300 rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default function FeaturedShop() {
  const { featuredShop, featuredShopError, featuredShopLoading, fetchFeaturedShop } = useExploreStore()

  useEffect(() => {
    fetchFeaturedShop()
  }, [fetchFeaturedShop])

  if (featuredShopLoading) return <FeaturedShopSkeleton />
  if (featuredShopError) return null
  if (!featuredShop) return null

  return (
    <div className="sm:col-span-2">
      <h3 className="flex-1 text-xs font-semibold uppercase tracking-wider text-stone-500">Featured shop</h3>
      <div className="list-none mt-3">
        <ShopCard featured shop={featuredShop} />
      </div>
    </div>
  )
}
