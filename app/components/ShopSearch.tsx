'use client'

import { useDisplayedShops } from '@/stores/coffeeShopsStore'
import { AmenityFilterList } from './AmenityFilterList'
import ShopList from '@/app/components/ShopList'

export default function ShopSearch() {
  const displayedShops = useDisplayedShops()

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 sm:px-6">
      <div className="mt-12">
        <AmenityFilterList />
        <ShopList coffeeShops={displayedShops.features} />
      </div>
    </div>
  )
}
