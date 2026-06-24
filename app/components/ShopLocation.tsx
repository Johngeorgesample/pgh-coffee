import { MapPinIcon } from '@heroicons/react/24/outline'
import { getGoogleMapsUrl } from './DirectionsButton'

interface IProps {
  address: string
  // GeoJSON order: [longitude, latitude]
  coordinates: [number, number]
}

const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN

/**
 * Builds a Mapbox Static Images URL with a marker at the shop. Returns null
 * when the token is missing or the shop has no real coordinates (utils default
 * unset coords to [0, 0]), so we don't render a pin in the Atlantic.
 */
const buildStaticMapUrl = (lng: number, lat: number) => {
  if (!MAPBOX_TOKEN || (lng === 0 && lat === 0)) return null
  const marker = `pin-l+fbbf24(${lng},${lat})`
  return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${marker}/${lng},${lat},14,0/600x320@2x?access_token=${MAPBOX_TOKEN}`
}

export default function ShopLocation({ address, coordinates }: IProps) {
  const [lng, lat] = coordinates
  const mapUrl = buildStaticMapUrl(lng, lat)
  // Preserve the existing (double-swapped) call so the Google Maps query stays
  // lat,lng — see DirectionsButton.getGoogleMapsUrl.
  const mapsHref = getGoogleMapsUrl({ latitude: coordinates[0], longitude: coordinates[1] })

  return (
    <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="block group">
      {mapUrl && (
        <img
          src={mapUrl}
          alt={`Map showing ${address}`}
          loading="lazy"
          className="mb-3 h-36 w-full rounded-xl border border-stone-200 object-cover"
        />
      )}
      <address className="not-italic flex items-start gap-2 text-sm font-medium text-stone-800 group-hover:text-amber-700 transition-colors leading-snug">
        <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0" />
        {address}
      </address>
    </a>
  )
}
