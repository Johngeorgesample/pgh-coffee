'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import PanelHeader from './PanelHeader'

interface IProps {
  shop: TShop
}

// @TODO extract this somewhere higher to avoid duplication
type TShop = {
  name: string,
  neighborhood: string, // @TODO should this be a union type?
  address: string,
  website: string, // @TODO how can I verify a URL is valid? Is that a fool's errand?
  value: any,
}

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
