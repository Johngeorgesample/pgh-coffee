'use client'

import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { TShop } from '@/types/shop-types'

interface IProps {
  shop: TShop
  emitClose: Function
}

export default function PanelHeader(props: IProps) {
  return (
    <div className="">
      <div className="h-56 relative bg-yellow-200 bg-cover bg-center" style={props.shop.value && props.shop.value.photo && {backgroundImage: `url('${props.shop.value.photo}')`}}>
        <div className="py-2 px-4 sm:px-6 absolute w-full bottom-0 backdrop-blur-xl bg-white/40 flex items-center justify-between">
          <Dialog.Title className="text-3xl text-gray-900">
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
