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
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  useEffect(() => {
    if (props.isOpen) {
      setCurrentPhotoIndex(0)
    }
  }, [props.isOpen])

  const updatePhoto = (direction: 'previous' | 'next') => {
    setCurrentPhotoIndex(prevIndex => (direction === 'next' ? prevIndex + 1 : prevIndex - 1))
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
        <div className="flex min-h-full items-end justify-center p-4 text-center items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg text-left transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-4xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="flex items-center align-center justify-center">
              <button
                className="h-12 w-12 disabled:hidden"
                disabled={currentPhotoIndex >= photos.length - 1}
                onClick={() => updatePhoto('previous')}
              >
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
              </button>
              <img className="max-w-[90%] max-h-[74vh] w-auto h-auto" src={photos[currentPhotoIndex]} />
              <button
                className="h-12 w-12 disabled:hidden"
                disabled={!(currentPhotoIndex < photos.length - 1)}
                onClick={() => updatePhoto('next')}
              >
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
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
