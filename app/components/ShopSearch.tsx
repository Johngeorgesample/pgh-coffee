'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import useShopsStore, { useDisplayedShops } from '@/stores/coffeeShopsStore'
import ShopList from '@/app/components/ShopList'

const AmenityFilterList = dynamic(() => import('./AmenityFilterList').then(m => ({ default: m.AmenityFilterList })), {
  ssr: false,
})

export default function ShopSearch() {
  const displayedShops = useDisplayedShops()
  const searchValue = useShopsStore(s => s.searchValue)
  const isSearching = searchValue.length > 0

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 sm:px-6">
      <div className="mt-12">
        {!isSearching && <AmenityFilterList />}
        <ShopList coffeeShops={displayedShops.features} />
        {isSearching && displayedShops.features.length === 0 && (
          <div className="mt-6 text-center text-gray-500">
            <p className="font-medium text-gray-700">No shops match &ldquo;{searchValue}&rdquo;</p>
            <p className="mt-1 text-sm">
              Try a different name or neighborhood, or{' '}
              <Link href="/submit-a-shop" className="underline">
                tell us about a shop we&rsquo;re missing
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
