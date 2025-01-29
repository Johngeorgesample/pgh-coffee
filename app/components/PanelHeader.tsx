'use client'

import { useState } from 'react'
import { usePlausible } from 'next-plausible'
import { TShop } from '@/types/shop-types'
import PhotoDialog from './PhotoDialog'
import { PhotoIcon } from '@heroicons/react/24/outline'

interface IProps {
  shop: TShop
}

export default function PanelHeader(props: IProps) {
  const { name, neighborhood, photo } = props.shop.properties
  const plausible = usePlausible()
  const [photoDialogIsOpen, setPhotoDialogIsOpen] = useState(false)

  const handleHeaderClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setPhotoDialogIsOpen(true)

      plausible('PanelHeaderClick', {
        props: {
          shopName: name,
          neighborhood: neighborhood,
        },
      })
    }
  }

  const hasPhoto = !!photo

  return (
    <div id="header">
      <div
        className={`group h-56 relative bg-yellow-200 bg-cover bg-center ${
          hasPhoto ? 'hover:cursor-pointer' : ''
        }`}
        style={hasPhoto ? { backgroundImage: `url('${photo}')` } : undefined}
        onClick={hasPhoto ? handleHeaderClick : undefined}
      >
        { hasPhoto && (
          <div
            className="group-hover:inline-flex absolute bottom-0 m-2 hidden bg-black bg-opacity-50 text-white p-1 rounded-md"
            role="button"
            aria-label="open photo gallery"
          >
            <PhotoIcon className="w-6 pr-1" />

            <p className="text-sm">See photos</p>
          </div>
        )}
      </div>
      <PhotoDialog shop={props.shop} isOpen={photoDialogIsOpen} handleClose={() => setPhotoDialogIsOpen(false)} />
    </div>
  )
}
