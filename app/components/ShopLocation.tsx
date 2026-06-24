import { MapPinIcon } from '@heroicons/react/24/outline'
import { getGoogleMapsUrl } from './DirectionsButton'

interface IProps {
  address: string
  // GeoJSON order: [longitude, latitude]
  coordinates: [number, number]
}

/**
 * Points at our own static-map proxy (CDN-cached) rather than Mapbox directly,
 * so repeat views don't each burn a Mapbox request. Returns null when the shop
 * has no real coordinates (utils default unset coords to [0, 0]) so we don't
 * render a map of the Atlantic.
 */
const buildStaticMapUrl = (lng: number, lat: number) => {
  if (lng === 0 && lat === 0) return null
  return `/api/shops/static-map/${lng}/${lat}`
}

export default function ShopLocation({ address, coordinates }: IProps) {
  const [lng, lat] = coordinates
  const mapUrl = buildStaticMapUrl(lng, lat)
  // Preserve the existing (double-swapped) call so the Google Maps query stays
  // lat,lng — see DirectionsButton.getGoogleMapsUrl.
  const mapsHref = getGoogleMapsUrl({ latitude: coordinates[0], longitude: coordinates[1] })

  return (
    <>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Location</p>
      <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="block group">
      {mapUrl && (
        <div className="relative mb-3">
          <img
            src={mapUrl}
            alt={`Map showing ${address}`}
            loading="lazy"
            className="h-36 w-full rounded-xl border border-stone-200 object-cover"
          />
          {/* Matches the main map's yellow circle marker (see MapContainer). */}
          <span className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FDE047] ring-2 ring-white" />
        </div>
      )}
      <address className="not-italic flex items-start gap-2 text-sm font-medium text-stone-800 group-hover:text-amber-700 transition-colors leading-snug">
        <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0" />
        {address}
      </address>
      </a>
    </>
  )
}
