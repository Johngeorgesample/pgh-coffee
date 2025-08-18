'use client'

import { useEffect, useState } from 'react'
import useShopsStore from '@/stores/coffeeShopsStore'
import ShopList from './ShopList'
import { formatDataToGeoJSON } from '../utils/utils'

interface IProps {
  content: any
}

export const CuratedList = (props: IProps) => {
  const { setAllShops } = useShopsStore()
  useEffect(() => {
    setAllShops(props.content.shops)
  }, [])
  return (
    <div className="mt-20">
      <div className="flex h-full flex-col overflow-y-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-901 mb-2">{props.content.title}</h1>
        <p className="text-base text-gray-600 mb-4">{props.content.description}</p>
        <hr />
        {props.content.shops.length > 0 ? <ShopList coffeeShops={props.content.shops} /> : <div>No shops found</div>}
      </div>
    </div>
  )
}
