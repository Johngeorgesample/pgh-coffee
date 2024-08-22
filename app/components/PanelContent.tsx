'use client'

import { useState } from 'react'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { TShop } from '@/types/shop-types'
import {TNeighborhood} from '@/types/neighborhood-types'
import shopGeoJSON from '@/data/coffee_shops_geojson.json'
import NearbyShops from './NearbyShops'

interface IProps {
  shop: TShop
}

// @TODO PanelBody might be a better name?
export default function PanelContent(props: IProps) {

  const amenities = props.shop?.value?.amenities
  const massagedAmenities = []

  if (amenities) {
    for (let [key, value] of Object.entries(amenities)) {
      if (value) {
        massagedAmenities.push(key)
      }
    }
  }

  const getListOfShopsInSameNieghborhood = (shop: any) => {
    const shops = shopGeoJSON.features

    return shops.filter(s => {
      if (shop.address !== s.properties.address) {
        return s.properties.neighborhood === shop.neighborhood
      }
    })
  }

  const handleClick = () => {
    console.log(getListOfShopsInSameNieghborhood(props.shop.neighborhood as TNeighborhood))
  }


  return (
    <div className="relative mt-6 flex-1 px-4 sm:px-6">
      {props.shop.website && (
        <a
          className="mt-1 text-sm text-gray-900 flex items-center hover:underline"
          href={props.shop.website}
          target="_blank"
        >
          {props.shop.website}
          <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4 inline" aria-hidden="true" />
        </a>
      )}
      <address className="mt-1 text-sm text-gray-900">{props.shop.address}</address>
      <button onClick={handleClick} className="mt-1 text-sm text-gray-900">{props.shop.neighborhood}</button>

      {massagedAmenities.length > 0 && (
        <>
          <p className="mt-1 text-sm text-gray-900">Amenities</p>
          <ul>
            {massagedAmenities.map(amenity => {
              return (
                <li key={amenity} className="mt-1 ml-6 list-disc text-sm text-gray-900">
                  {amenity}
                </li>
              )
            })}
          </ul>
        </>
      )}

      <NearbyShops shops={getListOfShopsInSameNieghborhood(props.shop)} />
    </div>
  )
}
