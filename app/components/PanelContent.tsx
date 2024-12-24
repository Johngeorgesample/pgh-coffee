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
      <div className="relative mt-4 mb-3 flex-1 text-2xl px-4 sm:px-6">
        <p>{props.shop.properties.name}</p>
      </div>
      <hr />
      <div className="relative mt-2 flex-1 px-4 sm:px-6">
        {props.shop.properties.website && (
          <div className="flex mt-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
            <a
              className="group text-sm text-gray-900 flex items-center hover:underline"
              href={props.shop.properties.website}
              target="_blank"
            >
              {props.shop.properties.website}
              <ArrowTopRightOnSquareIcon className="hidden group-hover:inline ml-1 h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        )}
        <div className="flex mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 mr-2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
          <a
            href={`https://www.google.com/maps?q=${props.shop.geometry.coordinates[1]},${props.shop.geometry.coordinates[0]}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <address className="text-sm text-gray-900">{props.shop.properties.address}</address>
          </a>
        </div>

        <div className="flex mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 mr-2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
          <p className="text-sm text-gray-900">{props.shop.properties.neighborhood}</p>
        </div>
      </div>
      <NearbyShops shop={props.shop} handleClick={props.handleNearbyShopClick} />
    </>
  )
}
