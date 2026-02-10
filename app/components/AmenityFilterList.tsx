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

  const { allShops, setDisplayedShops } = useShopsStore()
  const { setPanelContent } = usePanelStore()
  const handleClick = (amenity: string) => {
    const filtered: TFeatureCollection = {
      type: 'FeatureCollection',
      features: allShops.features.filter((shop) => shop.properties.amenities?.includes(amenity)),
    }
    setDisplayedShops(filtered)
    setPanelContent(<ShopList coffeeShops={filtered.features} />, 'list')
  }
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {amenities.map((amenity, idx) =>
        idx < 6 ? (
          <AmenityChip key={String(amenity)} amenity={String(amenity)} onClick={() => handleClick(amenity)} />
        ) : (
          ''
        ),
      )}
    </div>
  )
}
