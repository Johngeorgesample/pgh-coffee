'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { TShop } from '@/types/shop-types'
import PhotoDialog from './PhotoDialog'

interface IProps {
  shop: TShop
  emitClose: Function
}

export default function PanelHeader(props: IProps) {
  const [photoDialogIsOpen, setPhotoDialogIsOpen] = useState(false)

  const handleHeaderClick = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log(event)
    if (event.target === event.currentTarget) {
      setPhotoDialogIsOpen(true)
    }
  }

  return (
    <div className="" id="header">
      <div
        className="h-56 relative bg-yellow-200 bg-cover bg-center hover:cursor-pointer"
        style={props.shop.properties.photo ? { backgroundImage: `url('${props.shop.properties.photo}')` } : undefined}
        onClick={props.shop.properties.photo ? handleHeaderClick : undefined}
      >
        <div className="py-2 px-4 sm:px-6 absolute w-full bottom-0 backdrop-blur-xl bg-white/40 flex items-center justify-between hover:cursor-auto">
          <Dialog.Title className="text-3xl text-gray-900">{props.shop.properties.name}</Dialog.Title>
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
      <PhotoDialog shop={props.shop} isOpen={photoDialogIsOpen} handleClose={() => setPhotoDialogIsOpen(false)} />
    </div>
  )
}
