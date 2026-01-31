'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

interface Props {
  isOpen: boolean
  onClose: () => void
  shopName: string
}

export default function IssueModal({ isOpen, onClose, shopName }: Props) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative max-w-md w-full bg-white rounded-xl p-6 shadow-xl">
          <DialogTitle>
          <p className="font-bold">Save to list</p>
          <p>{shopName}</p>
          </DialogTitle>

          <hr />
          <p>lists go here</p>
          <hr />
          <p>Create new list button</p>
          <p>Saved to X lists</p>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
