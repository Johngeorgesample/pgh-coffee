'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { TShop } from '@/types/shop-types'
import IssueForm from './IssueForm'

interface Props {
  isOpen: boolean
  onClose: () => void
  shop: TShop
}

export default function IssueModal({ isOpen, onClose, shop }: Props) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="max-w-md w-full bg-white rounded-xl p-6 shadow-xl">
          <DialogTitle className="text-lg font-semibold text-stone-900 mb-2">Report an issue</DialogTitle>
          <IssueForm shop={shop} />
        </DialogPanel>
      </div>
    </Dialog>
  )
}
