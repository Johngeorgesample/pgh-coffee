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

export const amenityMap: Record<string, { label: string; icon: LucideIcon }> = {
  free_wifi: { label: 'Free Wi-Fi', icon: Wifi },
  no_wifi: { label: 'No Wi-Fi', icon: WifiOff },
  onsite_parking: { label: 'Onsite Parking', icon: Car },
  street_parking: { label: 'Street Parking', icon: SquareParking },
  garage_nearby: { label: 'Garage Nearby', icon: Warehouse },
  pastries: { label: 'Pastries', icon: Croissant },
  snacks: { label: 'Snacks', icon: Cookie },
  full_food_menu: { label: 'Full Food Menu', icon: UtensilsCrossed },
  dogs_inside: { label: 'Dogs Inside', icon: Dog },
  dogs_patio: { label: 'Dogs on Patio', icon: Dog },
  patio_seating: { label: 'Patio Seating', icon: Umbrella },
  sidewalk_seating: { label: 'Sidewalk Seating', icon: TreePine },
  outlets_abundant: { label: 'Abundant Outlets', icon: Plug },
  outlets_limited: { label: 'Limited Outlets', icon: Plug },
  seating_spacious: { label: 'Spacious Seating', icon: Armchair },
  seating_moderate: { label: 'Moderate Seating', icon: Armchair },
  seating_tight: { label: 'Tight Seating', icon: Armchair },
  cash_only: { label: 'Cash Only', icon: Banknote },
  card_only: { label: 'Card Only', icon: CreditCard },
  restroom: { label: 'Restroom', icon: DoorOpen },
  no_restroom: { label: 'No Restroom', icon: DoorClosed },
}

interface AmenityChipProps {
  amenity: string
  active?: boolean
  onClick?: () => void
}

export default function AmenityChip({ amenity, active, onClick }: AmenityChipProps) {
  const entry = amenityMap[amenity]
  if (!entry) return null

  const Icon = entry.icon

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
        active
          ? 'bg-stone-700 text-white'
          : `bg-stone-100 text-stone-700 ${onClick ? 'hover:bg-stone-200' : ''}`
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <Icon size={14} strokeWidth={2} />
      {entry.label}
    </span>
  )
}
