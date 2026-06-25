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
      aria-label="Directions"
      title="Directions"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 transition-colors"
    >
      <MapPin className="size-[18px]" />
    </a>
  )
}
