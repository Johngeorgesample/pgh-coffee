import { MapPin } from 'lucide-react'
import { getGoogleMapsUrl } from '@/app/utils/maps'

interface DirectionsButtonProps {
  coordinates: [number, number]
}

export default function DirectionsButton({ coordinates }: DirectionsButtonProps) {
  return (
    <a
      href={getGoogleMapsUrl({
        latitude: coordinates[0],
        longitude: coordinates[1],
      })}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-800 px-4 py-2.5 rounded-3xl text-sm font-medium border border-stone-200 transition-colors"
    >
      <MapPin className="size-4" />
      Directions
    </a>
  )
}
