'use client'

import dynamic from 'next/dynamic'
import useShopsStore, { useDisplayedShops } from '@/stores/coffeeShopsStore'
import ShopList from '@/app/components/ShopList'

const AmenityFilterList = dynamic(() => import('./AmenityFilterList').then(m => ({ default: m.AmenityFilterList })), {
  ssr: false,
})

export default function ShopSearch() {
  const displayedShops = useDisplayedShops()
  const isSearching = useShopsStore(s => s.searchValue.length > 0)

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 sm:px-6">
      <div className="mt-12">
        {!isSearching && <AmenityFilterList />}
        <ShopList coffeeShops={displayedShops.features} />
      </div>
    </div>
  )
}
