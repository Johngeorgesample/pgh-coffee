'use client'

import { useEffect } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { Check } from 'lucide-react'

interface CopyLinkToastProps {
  isOpen: boolean
  onClose: () => void
}

export default function CopyLinkToast({ isOpen, onClose }: CopyLinkToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
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
              <DialogPanel className="bg-stone-900 text-white rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-sm font-medium">Link copied to clipboard</p>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
