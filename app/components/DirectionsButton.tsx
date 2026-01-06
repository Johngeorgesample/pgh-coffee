import { MapPinIcon } from '@heroicons/react/24/outline'

interface DirectionsButtonProps {
  coordinates: [number, number]
}

export const getGoogleMapsUrl = (coordinates: { latitude: number; longitude: number }) =>
  `https://www.google.com/maps?q=${coordinates.longitude},${coordinates.latitude}`

export default function DirectionsButton({ coordinates }: DirectionsButtonProps) {
  return (
    <a
      href={getGoogleMapsUrl({
        latitude: coordinates[0],
        longitude: coordinates[1],
      })}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-800 px-4 py-2.5 rounded-lg text-sm font-medium border border-stone-200 transition-colors"
    >
      <MapPinIcon className="w-4 h-4" />
      Directions
    </a>
  )
}
