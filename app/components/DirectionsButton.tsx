import { MapPin } from 'lucide-react'

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
      className="inline-flex flex-1 items-center justify-center gap-1.5 bg-gray-950 hover:bg-gray-800 text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-colors"
    >
      <MapPin className="h-4 w-4" />
      Directions
    </a>
  )
}
