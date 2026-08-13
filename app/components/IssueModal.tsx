'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { TShop } from '@/types/shop-types'
import IssueForm from './IssueForm'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  shop: TShop
}

export default function IssueModal({ isOpen, onClose, onSuccess, shop }: Props) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="relative max-w-md w-full bg-white rounded-xl p-6 shadow-xl transition-all motion-safe:data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in sm:motion-safe:data-closed:translate-y-0 sm:motion-safe:data-closed:scale-95"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <DialogTitle className="text-lg font-semibold text-stone-900 mb-2">Report an issue</DialogTitle>
          <p className="text-sm text-stone-600 mb-4">Tell us what&apos;s out of date and we&apos;ll take a look.</p>
          <IssueForm shop={shop} onSuccess={onSuccess} />
        </DialogPanel>
      </div>
    </Dialog>
  )
}
