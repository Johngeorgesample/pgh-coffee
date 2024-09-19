'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { TShop } from '@/types/shop-types'
import { TNeighborhood } from '@/types/neighborhood-types'
import NearbyShops from './NearbyShops'

interface IProps {
  handleNearbyShopClick: (shop: TShop) => void

  shop: TShop
}

// @TODO PanelBody might be a better name?
export default function PanelContent(props: IProps) {
  return (
    <>
      <div className="relative mt-6 flex-1 px-4 sm:px-6">
        {props.shop.properties.website && (
          <a
            className="mt-1 text-sm text-gray-900 flex items-center hover:underline"
            href={props.shop.properties.website}
            target="_blank"
          >
            {props.shop.properties.website}
            <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4 inline" aria-hidden="true" />
          </a>
        )}
        <address className="mt-1 text-sm text-gray-900">{props.shop.properties.address}</address>
        <p className="mt-1 text-sm text-gray-900">
          {props.shop.properties.neighborhood}
        </p>
      </div>
      <NearbyShops shop={props.shop} handleClick={props.handleNearbyShopClick} />
    </>
  )
}
