'use client'
import { TShop } from '@/types/shop-types'
import NearbyShops from './NearbyShops'
import { ShopNews } from './ShopNews'
import { GlobeAltIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { ShopEvents } from './ShopEvents'

interface IProps {
  shop: TShop
}

export const getGoogleMapsUrl = (coordinates: { latitude: number; longitude: number }) =>
  `https://www.google.com/maps?q=${coordinates.longitude},${coordinates.latitude}`

export default function PanelContent(props: IProps) {
  const { website, address } = props.shop.properties
  const coordinates = props.shop.geometry?.coordinates

  return (
    <div className="bg-[#FAF9F7]">
      {/* Quick Actions Bar */}
      <div className="flex gap-2 px-4 sm:px-6 py-4 bg-white border-b border-stone-200">
        <a
          href={getGoogleMapsUrl({
            latitude: coordinates[0],
            longitude: coordinates[1],
          })}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-stone-800 hover:bg-stone-900 
                     text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <MapPinIcon className="w-4 h-4" />
          Directions
        </a>
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 
                       text-stone-800 px-4 py-2.5 rounded-lg text-sm font-medium 
                       border border-stone-200 transition-colors"
          >
            <GlobeAltIcon className="w-4 h-4" />
            Website
          </a>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-3 px-4 sm:px-6 py-5">
        {/* Address Card */}
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <div className="text-xs text-stone-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
            <span>📍</span> Address
          </div>
          <a
            href={getGoogleMapsUrl({
              latitude: coordinates[0],
              longitude: coordinates[1],
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <address className="not-italic text-sm font-medium text-stone-800 group-hover:text-amber-700 transition-colors leading-snug">
              {address}
            </address>
          </a>
        </div>

        {/* Hours Card */}
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <div className="text-xs text-stone-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
            <span>🕐</span> Hours
          </div>
          <p className="text-sm font-medium text-emerald-600">
            Open
          </p>
          <p className="text-sm text-stone-400">
            Hours vary
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-stone-200 mx-4 sm:mx-6" />

      {/* Child components */}
      <ShopNews shop={props.shop} />
      <ShopEvents shop={props.shop} />
      <NearbyShops shop={props.shop} />
    </div>
  )
}
