'use client'

import { TShop } from '@/types/shop-types'

interface IProps {
  shop: TShop
}

// @TODO PanelBody might be a better name?
export default function PanelContent(props: IProps) {
  return (
    <div className="relative mt-6 flex-1 px-4 sm:px-6">
      <a className="mt-1 text-sm text-gray-900" href={props.shop.website} target="_blank">{props.shop.website}</a>
      <p className="mt-1 text-sm text-gray-900">{props.shop.neighborhood}</p>
      <address className="mt-1 text-sm text-gray-900">{props.shop.address}</address>
      <p className="mt-1 text-sm text-gray-900">Amenities</p>
    </div>
  )
}
