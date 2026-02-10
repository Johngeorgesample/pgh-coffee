import { useState } from 'react'

import { Plus } from 'lucide-react'

import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'
import AmenityChip from './AmenityChip'
import ShopList from './ShopList'
import { TFeatureCollection } from '@/types/shop-types'

// @TODO sort by prevalence
const amenities = [
  'free_wifi',
  'no_wifi',
  'onsite_parking',
  'street_parking',
  'garage_nearby',
  'pastries',
  'snacks',
  'full_food_menu',
  'dogs_inside',
  'dogs_patio',
  'patio_seating',
  'sidewalk_seating',
  'outlets_abundant',
  'outlets_limited',
  'seating_spacious',
  'seating_moderate',
  'seating_tight',
  'cash_only',
  'card_only',
  'restroom',
  'no_restroom',
]

export const AmenityFilterList = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { allShops, setDisplayedShops } = useShopsStore()
  const { setPanelContent } = usePanelStore()
  const handleClick = (amenity: string) => {
    const filtered: TFeatureCollection = {
      type: 'FeatureCollection',
      features: allShops.features.filter(shop => shop.properties.amenities?.includes(amenity)),
    }
    setDisplayedShops(filtered)
    setPanelContent(
      <div className="flex h-full flex-col overflow-y-auto px-4 sm:px-6">
        <div className="mt-12">
          <ShopList coffeeShops={filtered.features} />
        </div>
      </div>,

      'list',
    )
  }
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {(isExpanded ? amenities : amenities.slice(0, 6)).map(amenity => (
        <AmenityChip key={amenity} amenity={amenity} onClick={() => handleClick(amenity)} />
      ))}
      {!isExpanded && (
        <button
          className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700 hover:bg-stone-200"
          onClick={() => setIsExpanded(true)}
        >
          <Plus className="w-5 h-5" />
          More
        </button>
      )}
    </div>
  )
}
