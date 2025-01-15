'use client'

import { useState } from 'react'
import { usePlausible } from 'next-plausible'
import { TShop } from '@/types/shop-types'
import PhotoDialog from './PhotoDialog'

interface IProps {
  shop: TShop
  emitClose: Function
}

export default function PanelHeader(props: IProps) {
  const plausible = usePlausible()
  const [photoDialogIsOpen, setPhotoDialogIsOpen] = useState(false)

  const handleHeaderClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setPhotoDialogIsOpen(true)

      plausible('PanelHeaderClick', {
        props: {
          shopName: props.shop.properties.name,
          neighborhood: props.shop.properties.neighborhood,
        },
      })
    }
  }

  return (
    <div className="" id="header">
      <div
        className={`group h-56 relative bg-yellow-200 bg-cover bg-center ${
          props.shop.properties.photo ? 'hover:cursor-pointer' : ''
        }`}
        style={props.shop.properties.photo ? { backgroundImage: `url('${props.shop.properties.photo}')` } : undefined}
        onClick={props.shop.properties.photo ? handleHeaderClick : undefined}
      >
        {props.shop.properties.photo && (
          <div className="group-hover:inline-flex absolute bottom-0 m-2 hidden bg-black bg-opacity-50 text-white p-1 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 pr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>

            <p className="text-sm">See photos</p>
          </div>
        )}
      </div>
      <PhotoDialog shop={props.shop} isOpen={photoDialogIsOpen} handleClose={() => setPhotoDialogIsOpen(false)} />
    </div>
  )
}
