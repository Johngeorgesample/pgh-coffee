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
  const updatePhoto = (direction: 'previous' | 'next') => {
    console.log(direction)
  }
  return (
    <Dialog open={props.isOpen} onClose={props.handleClose} className="relative z-10">
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
            <div className="flex items-center">
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
              <img className="w-[90%]" src={props.shop.properties.photo} />
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
