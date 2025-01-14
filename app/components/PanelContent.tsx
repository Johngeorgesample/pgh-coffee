'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { TShop } from '@/types/shop-types'
import NearbyShops from './NearbyShops'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { MapPinIcon } from '@heroicons/react/24/outline'

interface IProps {
  handleNearbyShopClick: (shop: TShop) => void
  shop: TShop
}

const getGoogleMapsUrl = (coordinates: { latitude: number; longitude: number }) =>
  `https://www.google.com/maps?q=${coordinates.longitude},${coordinates.latitude}`

// @TODO PanelBody might be a better name?
export default function PanelContent(props: IProps) {
  return (
    <>
      <div className="flex flex-col align-center mt-4 text-2xl px-4 sm:px-6">
        <p className="font-medium">{props.shop.properties.name}</p>
        <p className="text-lg text-gray-600">{props.shop.properties.neighborhood}</p>
      </div>
      <div className="relative text-gray-700 flex-1 px-4 sm:px-6">
        {props.shop.properties.website && (
          <div className="flex mt-2">

            <GlobeAltIcon className="w-4 mr-1" />
            <a
              className="group text-sm flex items-center hover:underline"
              href={props.shop.properties.website}
              target="_blank"
            >
              {props.shop.properties.website}
              <ArrowTopRightOnSquareIcon className="hidden group-hover:inline ml-1 h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        )}
        <div className="flex mt-2">
            <MapPinIcon className="w-4 mr-1" />
          <a
            href={getGoogleMapsUrl({
              latitude: props.shop.geometry.coordinates[0],
              longitude: props.shop.geometry.coordinates[1],
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <address className="text-sm hover:underline">{props.shop.properties.address}</address>
          </a>
        </div>
      </div>
      <NearbyShops shop={props.shop} handleClick={props.handleNearbyShopClick} />
    </>
  )
}
