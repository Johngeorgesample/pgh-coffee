'use client'

import { useState, useEffect } from 'react'
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
  const [ list, setList ] = useState([])

  const amenities = props.shop?.value?.amenities
  const massagedAmenities = []

  if (amenities) {
    for (let [key, value] of Object.entries(amenities)) {
      if (value) {
        massagedAmenities.push(key)
      }
    }
  }

  const localList = []

  const getListOfShopsInSameNieghborhood = (neighborhood: TNeighborhood) => {
    const shops = shopGeoJSON.features

    shops.map(shop => {
      if (shop.properties.neighborhood === neighborhood) {
        localList.push(shop)
      }
    })
    setList(localList)

    console.log(list)
  }

  useEffect(() => {
    getListOfShopsInSameNieghborhood(props.shop.neighborhood as TNeighborhood)
  }, [])

  const handleClick = () => {
    // console.log(props.shop)
    // getListOfShopsInSameNieghborhood(props.shop.neighborhood as TNeighborhood)
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

      <NearbyShops shops={list} />

    </div>
  )
}
