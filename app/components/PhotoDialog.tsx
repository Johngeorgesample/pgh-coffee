'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { TShop } from '@/types/shop-types'

interface TProps {
  handleClose: () => void
  isOpen: boolean
  shop: TShop
}

export default function PhotoDialog(props: TProps) {
  let photos = [props.shop.properties.photo]
  photos = [...photos, 'https://www.johngeorgesample.com/bugbite.webp']
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  useEffect(() => {
    if (props.isOpen) {
      setCurrentPhotoIndex(0)
    }
  }, [props.isOpen])

  const updatePhoto = (direction: 'previous' | 'next') => {
    setCurrentPhotoIndex((prevIndex) => {
      if (direction === 'next') {
        return prevIndex >= photos.length - 1 ? 0 : prevIndex + 1
      }
      if (direction === 'previous') {
        return prevIndex > 0 ? prevIndex - 1 : photos.length - 1
      }
      return prevIndex
    })
  }

  const handleClose = () => {
    props.handleClose()
  }

  return (
    <Dialog open={props.isOpen} onClose={handleClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg text-left transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-4xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="flex items-center align-center justify-center">
              <div className="h-12 w-12" onClick={() => updatePhoto('previous')}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="text-white hover:cursor-pointer"
                >
                  {' '}
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />{' '}
                </svg>
              </div>
              <img className="max-w-[90%] max-h-[74vh] w-auto h-auto" src={photos[currentPhotoIndex]} />
              <div className="h-12 w-12" onClick={() => updatePhoto('next')}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="text-white hover:cursor-pointer"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
