'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import AuthForm from './AuthForm'

interface LoginPromptModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginPromptModal({ isOpen, onClose }: LoginPromptModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="max-w-md w-full bg-white rounded-xl p-6 shadow-xl transition-all motion-safe:data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in sm:motion-safe:data-closed:translate-y-0 sm:motion-safe:data-closed:scale-95"
        >
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
