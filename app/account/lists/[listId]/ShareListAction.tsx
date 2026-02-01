'use client'

import { useState } from 'react'
import { Share2 } from 'lucide-react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

const buttonClass =
  'inline-flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-800 border border-stone-200 transition-colors'

export default function ShareListAction() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={buttonClass} aria-label="Share list">
        <Share2 className="w-4 h-4" />
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-w-lg w-full bg-white rounded-xl p-6 shadow-xl">
            <DialogTitle className="text-lg font-semibold text-stone-900 mb-4">
              Share this list
            </DialogTitle>
            <div className="space-y-4">
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 break-all text-sm text-stone-700">
                {currentUrl}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 bg-stone-800 hover:bg-stone-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
