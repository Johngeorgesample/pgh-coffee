'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { MapPinIcon } from '@heroicons/react/24/outline'
import useShopsStore, { useDisplayedShops, useIsClosed } from '@/stores/coffeeShopsStore'
import ShopList from '@/app/components/ShopList'
import EntitySearchResults from '@/app/components/EntitySearchResults'
import { useMatchedEntities } from '@/hooks/useMatchedEntities'

const AmenityFilterList = dynamic(() => import('./AmenityFilterList').then(m => ({ default: m.AmenityFilterList })), {
  ssr: false,
})

export default function ShopSearch() {
  const displayedShops = useDisplayedShops()
  const isClosed = useIsClosed()
  const listedShops = displayedShops.features.filter(shop => !isClosed(shop.properties.uuid))
  const searchValue = useShopsStore(s => s.searchValue)
  const isSearching = searchValue.length > 0
  const entities = useMatchedEntities(searchValue)
  const entityCount = isSearching ? entities.roasters.length + entities.companies.length : 0
  const shopCount = listedShops.length
  const setSearchValue = useShopsStore(s => s.setSearchValue)

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 sm:px-6">
      <div className="mt-12">
        {!isSearching && <AmenityFilterList />}
        {isSearching && (
          <Link
            href={`/?near=${encodeURIComponent(searchValue)}`}
            onClick={() => setSearchValue('')}
            className="mb-2 flex w-full items-center gap-2 border-b border-stone-200 py-3 text-left text-gray-900 hover:text-amber-700"
          >
            <MapPinIcon className="size-4 shrink-0" />
            <span className="truncate">Shops near &ldquo;{searchValue}&rdquo;</span>
          </Link>
        )}
        {entityCount > 0 && <EntitySearchResults {...entities} />}
        {entityCount > 0 && shopCount > 0 && (
          <h2 className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Shops</h2>
        )}
        <ShopList coffeeShops={listedShops} />
        {isSearching && shopCount === 0 && entityCount === 0 && (
          <div className="mt-6 text-center text-gray-500">
            <p className="font-medium text-gray-700">Nothing matches &ldquo;{searchValue}&rdquo;</p>
            <p className="mt-1 text-sm">
              Try a different shop, roaster, or neighborhood, or{' '}
              <Link href="/submit-a-shop" className="underline">
                tell me about a shop I&rsquo;m missing
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
