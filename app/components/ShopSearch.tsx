'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import useShopsStore, { useDisplayedShops } from '@/stores/coffeeShopsStore'
import ShopList from '@/app/components/ShopList'
import { areaPath, groupShopsIntoAreas, shopNoun } from '@/app/utils/neighborhoodAreas'
import { slugify } from '@/app/utils/shopSlug'
import { MapPinIcon } from '@heroicons/react/24/outline'

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
  const searchValue = useShopsStore(s => s.searchValue)
  const allShops = useShopsStore(s => s.allShops)
  const areaLinks = matchingAreaLinks(searchValue, allShops.features)

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 sm:px-6">
      <div className="mt-12">
        <AmenityFilterList />
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
        <ShopList coffeeShops={displayedShops.features} />
      </div>
    </div>
  )
}
