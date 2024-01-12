'use client'

import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface IProps {
  shop: TShop
  emitClose: Function
}

// @TODO extract this somewhere higher to avoid duplication
type TShop = {
  name: string,
  neighborhood: string, // @TODO should this be a union type?
  address: string,
  website: string, // @TODO how can I verify a URL is valid? Is that a fool's errand?
  value: any,
}

export default function PanelHeader(props: IProps) {
  return (
    <div className="">
      {/* <div className="h-56 relative bg-red-100 bg-[url('https://images.unsplash.com/photo-1516197370049-569c4eaba1d6')] bg-cover bg-center"> */}
      <div className="h-56 relative bg-yellow-100 bg-cover bg-center" style={props.shop.value && props.shop.value.photo && {backgroundImage: `url('${props.shop.value.photo}')`}}>
        <div className="py-2 px-4 sm:px-6 absolute w-full bottom-0 backdrop-blur-md flex items-center justify-between">
          <Dialog.Title className="text-4xl text-gray-900">
            {props.shop.name}
          </Dialog.Title>
          <div className="ml-3 flex h-7 items-center">
            <button
              type="button"
              className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => props.emitClose()}
            >
              <span className="absolute -inset-2.5" />
              <span className="sr-only">Close panel</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
