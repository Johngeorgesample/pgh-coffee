import { getAmenity } from '@/lib/amenities'

interface AmenityChipProps {
  amenity: string
  active?: boolean
  onClick?: () => void
}

export default function AmenityChip({ amenity, active, onClick }: AmenityChipProps) {
  const entry = getAmenity(amenity)
  if (!entry) return null

  const Icon = entry.icon

  const className = `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
    active
      ? 'bg-stone-700 text-white'
      : `bg-stone-100 text-stone-700 ${onClick ? 'hover:bg-stone-200' : ''}`
  } ${onClick ? 'cursor-pointer' : ''}`

  const content = (
    <>
      <Icon size={14} strokeWidth={2} />
      {entry.label}
    </>
  )

  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        {content}
      </button>
    )
  }

  return <span className={className}>{content}</span>
}
