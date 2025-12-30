'use client'

import { ArrowTopRightOnSquareIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline'
import { TShop } from '@/types/shop-types'
import usePanelStore from '@/stores/panelStore'
import NearbyShops from './NearbyShops'
import { Company } from '@/app/components/Company'
import { ShopNews } from './ShopNews'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { MapPinIcon } from '@heroicons/react/24/outline'

interface IProps {
  shop: TShop
}

export const getGoogleMapsUrl = (coordinates: { latitude: number; longitude: number }) =>
  `https://www.google.com/maps?q=${coordinates.longitude},${coordinates.latitude}`

// @TODO PanelBody might be a better name?
export default function PanelContent(props: IProps) {
  const { setPanelContent } = usePanelStore()
  const { name, neighborhood, website, address, company } = props.shop.properties
  const coordinates = props.shop.geometry?.coordinates

  return (
    <>
      <section>
        <div className="flex flex-col mt-4 text-2xl px-4 sm:px-6">
          <p className="font-medium">{name}</p>
          <p className="text-lg text-gray-600">{neighborhood}</p>
        </div>
        <div className="relative text-gray-700 px-4 sm:px-6">
          {company?.slug && (
            <div className="flex mt-2">
              <BuildingStorefrontIcon className="w-4 mr-1" />
              <button
                onClick={() => setPanelContent(<Company slug={company.slug} />, 'news')}
                className="text-sm flex items-center hover:underline cursor-pointer bg-transparent border-none p-0"
              >
                View all locations
              </button>
            </div>
          )}
          {website && (
            <div className="flex mt-2">
              <GlobeAltIcon className="w-4 mr-1" />
              <a className="group text-sm flex items-center hover:underline " href={website} target="_blank">
                {website}
                <ArrowTopRightOnSquareIcon className="hidden group-hover:inline ml-1 h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          )}
          <div className="flex mt-2">
            <MapPinIcon className="w-4 mr-1" />
            <a
              className="group text-sm flex items-center hover:underline"
              href={getGoogleMapsUrl({
                latitude: coordinates[0],
                longitude: coordinates[1],
              })}
              target="_blank"
              rel="noopener noreferrer"
            >
              <address className="text-sm hover:underline">{address}</address>
              <ArrowTopRightOnSquareIcon className="hidden group-hover:inline ml-1 h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
      <ShopNews shop={props.shop} />
      <NearbyShops shop={props.shop} />
    </>
  )
}
