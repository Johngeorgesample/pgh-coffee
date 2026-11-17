'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { MapPinIcon } from '@heroicons/react/24/outline'
import useShopsStore, { useDisplayedShops, useIsClosed } from '@/stores/coffeeShopsStore'
import ShopList from '@/app/components/ShopList'
import { areaPath, groupShopsIntoAreas, shopNoun } from '@/app/utils/neighborhoodAreas'
import { slugify } from '@/app/utils/shopSlug'
import EntitySearchResults from '@/app/components/EntitySearchResults'
import { useMatchedEntities } from '@/hooks/useMatchedEntities'

const AmenityFilterList = dynamic(() => import('./AmenityFilterList').then(m => ({ default: m.AmenityFilterList })), {
  ssr: false,
})

// Areas whose name starts with the search query, so typing "squi" surfaces the
// Squirrel Hill guide. Requires 3+ chars to keep single-letter queries quiet.
function matchingAreaLinks(searchValue: string, features: { properties: { neighborhood: string } }[]) {
  const query = slugify(searchValue)
  if (query.length < 3) return []
  const areas = groupShopsIntoAreas(features.map(f => f.properties))
  return areas.filter(({ area }) => slugify(area).startsWith(query))
}

export default function ShopSearch() {
  const displayedShops = useDisplayedShops()
  const isClosed = useIsClosed()
  const listedShops = [...displayedShops.features].sort(
    (a, b) => Number(isClosed(a.properties.uuid)) - Number(isClosed(b.properties.uuid)),
  )
  const searchValue = useShopsStore(s => s.searchValue)
  const allShops = useShopsStore(s => s.allShops)
  const areaLinks = matchingAreaLinks(searchValue, allShops.features)
  const isSearching = searchValue.length > 0
  const entities = useMatchedEntities(searchValue)
  const entityCount = isSearching ? entities.roasters.length + entities.companies.length : 0
  const shopCount = listedShops.length
  const setSearchValue = useShopsStore(s => s.setSearchValue)

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 sm:px-6">
      <div className="mt-12">
        {!isSearching && <AmenityFilterList />}
        {areaLinks.map(({ area, shops }) => (
          <Link
            key={area}
            href={areaPath(area)}
            className="mt-4 flex items-center gap-2 rounded-lg border border-stone-200 px-4 py-3 text-sm hover:bg-stone-50"
          >
            <MapPinIcon className="h-4 w-4 shrink-0" />
            <span>
              <span className="font-medium">Coffee shops in {area}</span>
              <span className="ml-2 text-stone-500">{shops.length} {shopNoun(shops.length)}</span>
            </span>
          </Link>
        ))}
        {isSearching && areaLinks.length === 0 && (
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
        <ShopList coffeeShops={listedShops} isClosed={isClosed} />
        {isSearching && shopCount === 0 && entityCount === 0 && areaLinks.length === 0 && (
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
