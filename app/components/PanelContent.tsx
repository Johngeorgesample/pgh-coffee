'use client'

import { useState } from 'react'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { TShop } from '@/types/shop-types'
import { TNeighborhood } from '@/types/neighborhood-types'
import shopGeoJSON from '@/data/coffee_shops_geojson.json'
import NearbyShops from './NearbyShops'
import haversineDistance from 'haversine-distance'

interface IProps {
  shop: any //TShop
}

// @TODO PanelBody might be a better name?
export default function PanelContent(props: IProps) {
  const amenities = props.shop.properties?.value?.amenities
  const massagedAmenities = []

  if (amenities) {
    for (let [key, value] of Object.entries(amenities)) {
      if (value) {
        massagedAmenities.push(key)
      }
    }
  }

  // naively use neighborhood as a proxy for distance
  // @TODO calculate distance between shops using lat/long
  const getListOfShopsInSameNieghborhood = (shop: any) => {
    const shops = shopGeoJSON.features

    return shops.filter(s => {
      if (shop.address !== s.properties.address) {
        return s.properties.neighborhood === shop.neighborhood
      }
    })
  }

  const shopsAreClose = (shopA: any, shopB: any) => {
    return haversineDistance(shopA, shopB) < 1000
  }

  const getNearbyShopsByDistance = () => {
    const shops = shopGeoJSON.features
    shops.filter(s => {
      if (props.shop.address !== s.properties.address) {
        // return shopsAreClose(props.shop.geometry.coordinates, s.geometry.coordinates)
        if (shopsAreClose(props.shop.geometry.coordinates, s.geometry.coordinates)) {
          console.log(s.properties.name, ' is close')
        }
      }
    })
  }

  const handleClick = () => {
    // console.log(getListOfShopsInSameNieghborhood(props.shop.properties.neighborhood as TNeighborhood))
    getNearbyShopsByDistance()
  }

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
        <button onClick={handleClick} className="mt-1 text-sm text-gray-900">
          {props.shop.properties.neighborhood}
        </button>

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
      </div>
      {<NearbyShops shop={props.shop} />}
    </>
  )
}
