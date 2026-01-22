'use client'

import { useEffect } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { Heart } from 'lucide-react'
import Link from 'next/link'

interface FavoriteToastProps {
  isOpen: boolean
  onClose: () => void
  shopName: string
}

export default function FavoriteToast({ isOpen, onClose, shopName }: FavoriteToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  return (
    <Transition show={isOpen}>
      <Dialog onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 pointer-events-none">
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
            <TransitionChild
              enter="transition ease-out duration-300"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
            >
              <DialogPanel className="bg-stone-900 text-white rounded-xl px-4 py-3 shadow-lg flex flex-col lg:flex-row items-center gap-3">
                <Heart className="w-5 h-5 fill-red-500 text-red-500 flex-shrink-0" />
                <p className="text-sm">
                  <span className="font-medium">{shopName}</span> added to favorites
                </p>
                <Link
                  href="/account/favorites"
                  onClick={onClose}
                  className="ml-2 text-sm font-medium text-yellow-300 hover:text-yellow-200 whitespace-nowrap"
                >
                  View favorites
                </Link>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
