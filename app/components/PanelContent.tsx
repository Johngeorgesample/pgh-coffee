'use client'

import { useState } from 'react'

import { TShop } from '@/types/shop-types'
import NearbyShops from './NearbyShops'
import { ShopNews } from './ShopNews'
import { ShopEvents } from './ShopEvents'
import QuickActionsBar from './QuickActionsBar'
import { getGoogleMapsUrl } from './DirectionsButton'
import PhotoGrid from './PhotoGrid'
import AmenityChip from './AmenityChip'
import AmenityReportModal from './AmenityReportModal'

interface IProps {
  shop: TShop
}

export default function PanelContent(props: IProps) {
  const [showAmenityModal, setShowAmenityModal] = useState(false)
  const { address, photos, amenities } = props.shop.properties
  const coordinates = props.shop.geometry?.coordinates

  return (
    <div className="bg-[#FAF9F7]">
      <QuickActionsBar shop={props.shop} />

      <div className="px-4 sm:px-6 py-5">
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

        {amenities && amenities.length > 0 && (
          <>
            <div className="flex flex-wrap gap-2 my-3">
              {amenities.map(amenity => (
                <AmenityChip key={String(amenity)} amenity={String(amenity)} />
              ))}
            </div>

            <p className="text-xs text-gray-700">
              Missing something?{' '}
              <button aria-label="Report amenity" className="text-amber-700" onClick={() => setShowAmenityModal(true)}>
                Let me know
              </button>
            </p>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-stone-200 mx-4 sm:mx-6" />

      {/* Child components */}
      {photos && <PhotoGrid photos={photos} />}
      <ShopNews shop={props.shop} />
      <ShopEvents shop={props.shop} />
      <NearbyShops shop={props.shop} />

      <AmenityReportModal
        isOpen={showAmenityModal}
        onClose={() => {
          setShowAmenityModal(false)
        }}
        onSuccess={() => {}}
        amenities={amenities?.map(String) ?? []}
        shopId={props.shop.properties.uuid}
      />
    </div>
  )
}
