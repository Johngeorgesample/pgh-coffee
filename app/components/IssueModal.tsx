'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
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
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative max-w-md w-full bg-white rounded-xl p-6 shadow-xl">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <DialogTitle className="text-lg font-semibold text-stone-900 mb-2">Suggest a correction</DialogTitle>
          <p className="text-sm text-stone-600 mb-4">Only update what&apos;s incorrect.</p>
          <IssueForm shop={shop} onSuccess={onSuccess} />
        </DialogPanel>
      </div>
    </Dialog>
  )
}
