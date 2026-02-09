import {
  Wifi,
  Dog,
  Plug,
  Armchair,
  TreePine,
  Croissant,
  Car,
  DoorOpen,
  type LucideIcon,
} from 'lucide-react'

const amenityMap: Record<string, { label: string; icon: LucideIcon }> = {
  free_wifi: { label: 'Free Wi-Fi', icon: Wifi },
  onsite_parking: { label: 'Onsite Parking', icon: Car },
  pastries: { label: 'Pastries', icon: Croissant },
  seating_moderate: { label: 'Moderate Seating', icon: Armchair },
  outlets_limited: { label: 'Limited Outlets', icon: Plug },
  sidewalk_seating: { label: 'Sidewalk Seating', icon: TreePine },
  dogs_inside: { label: 'Dogs Inside', icon: Dog },
  restroom: { label: 'Restroom', icon: DoorOpen },
}

interface AmenityChipProps {
  amenity: string
}

export default function AmenityChip({ amenity }: AmenityChipProps) {
  const entry = amenityMap[amenity]
  if (!entry) return null

  const Icon = entry.icon

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
      <Icon size={14} strokeWidth={2} />
      {entry.label}
    </span>
  )
}
