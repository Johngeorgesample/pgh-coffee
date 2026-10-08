import { MapPin } from 'lucide-react'

interface DirectionsButtonProps {
  coordinates: [number, number]
}

export const getGoogleMapsUrl = (coordinates: { latitude: number; longitude: number }) =>
  `https://www.google.com/maps?q=${coordinates.longitude},${coordinates.latitude}`

export const getMobileMapsUrl = (coordinates: [number, number], userAgent: string) => {
  const [lng, lat] = coordinates
  if (/iPhone|iPad|iPod/i.test(userAgent)) return `https://maps.apple.com/?daddr=${lat},${lng}`
  // geo: asks Android to open a capable maps app; it does not require Google Maps.
  if (/Android/i.test(userAgent)) return `geo:0,0?q=${lat},${lng}`
  return null
}

export const openMobileMaps = (event: React.MouseEvent<HTMLAnchorElement>, coordinates: [number, number]) => {
  const url = getMobileMapsUrl(coordinates, navigator.userAgent)
  if (url) {
    event.currentTarget.href = url
    event.currentTarget.target = '_self'
  }
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
      onClick={(event) => openMobileMaps(event, coordinates)}
      className="inline-flex flex-1 items-center justify-center gap-1.5 bg-gray-950 hover:bg-gray-800 text-white px-4 py-2.5 rounded-full text-sm font-semibold transition ease-out active:scale-95"
    >
      <MapPin className="h-4 w-4" />
      Directions
    </a>
  )
}
