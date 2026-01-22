'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import AuthForm from './AuthForm'

interface LoginPromptModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginPromptModal({ isOpen, onClose }: LoginPromptModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="max-w-md w-full bg-white rounded-xl p-6 shadow-xl">
          <DialogTitle className="text-lg font-semibold text-stone-900 mb-2">
            Sign in to save favorites
          </DialogTitle>
          <p className="text-sm text-stone-600 mb-6">
            Create a free account to save your favorite coffee shops and access them from any device.
          </p>

          <AuthForm onSuccess={onClose} idPrefix="login" />

          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors"
          >
            Cancel
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
