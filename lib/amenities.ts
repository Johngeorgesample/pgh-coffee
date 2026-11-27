import {
  Wifi,
  WifiOff,
  Dog,
  Plug,
  Armchair,
  TreePine,
  Croissant,
  Car,
  SquareParking,
  Warehouse,
  Cookie,
  UtensilsCrossed,
  Umbrella,
  DoorOpen,
  DoorClosed,
  Banknote,
  CreditCard,
  type LucideIcon,
} from 'lucide-react'
import type { AmenityKey } from './amenityKeys'

export { AMENITY_KEYS, type AmenityKey } from './amenityKeys'

export const amenityMap = {
  free_wifi: { label: 'Wi-Fi', icon: Wifi },
  no_wifi: { label: 'No Wi-Fi', icon: WifiOff },
  onsite_parking: { label: 'Onsite parking', icon: Car },
  street_parking: { label: 'Street parking', icon: SquareParking },
  garage_nearby: { label: 'Nearby garage', icon: Warehouse },
  pastries: { label: 'Pastries', icon: Croissant },
  snacks: { label: 'Snacks', icon: Cookie },
  full_food_menu: { label: 'Full food menu', icon: UtensilsCrossed },
  dogs_inside: { label: 'Dogs inside', icon: Dog },
  dogs_patio: { label: 'Dogs on patio', icon: Dog },
  patio_seating: { label: 'Patio seating', icon: Umbrella },
  sidewalk_seating: { label: 'Sidewalk seating', icon: TreePine },
  outlets_abundant: { label: 'Abundant outlets', icon: Plug },
  outlets_limited: { label: 'Limited outlets', icon: Plug },
  seating_spacious: { label: 'Spacious seating', icon: Armchair },
  seating_moderate: { label: 'Moderate seating', icon: Armchair },
  seating_tight: { label: 'Tight seating', icon: Armchair },
  cash_only: { label: 'Cash only', icon: Banknote },
  card_only: { label: 'Card only', icon: CreditCard },
  restroom: { label: 'Restroom', icon: DoorOpen },
  no_restroom: { label: 'No restroom', icon: DoorClosed },
} satisfies Record<AmenityKey, { label: string; icon: LucideIcon }>

export const getAmenity = (key: string): { label: string; icon: LucideIcon } | undefined =>
  (amenityMap as Record<string, { label: string; icon: LucideIcon }>)[key]
