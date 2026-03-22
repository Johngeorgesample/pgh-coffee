'use client'

import { useState } from 'react'
import { Share2 } from 'lucide-react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

const buttonClass =
  'inline-flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-800 border border-stone-200 transition-colors'

interface ShareListActionProps {
  listId: string
  isPublic: boolean
  onPublicChange: (isPublic: boolean) => void
}

export default function ShareListAction({ listId, isPublic, onPublicChange }: ShareListActionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [updating, setUpdating] = useState(false)

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const publicUrl = `${origin}/lists/${listId}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleTogglePublic = async () => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/lists/${listId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_public: !isPublic }),
      })
      if (res.ok) {
        onPublicChange(!isPublic)
      }
    } catch (err) {
      console.error('Failed to update list visibility:', err)
    } finally {
      setUpdating(false)
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
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={handleTogglePublic}
                  disabled={updating}
                  className="w-5 h-5 rounded border-stone-300 text-stone-800 focus:ring-stone-500"
                />
                <span className="text-stone-700">
                  Make this list public
                </span>
              </label>

              {isPublic ? (
                <>
                  <p className="text-sm text-stone-500">
                    Anyone with this link can view your list:
                  </p>
                  <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 break-all text-sm text-stone-700">
                    {publicUrl}
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
                </>
              ) : (
                <>
                  <p className="text-sm text-stone-500">
                    Enable sharing to get a link that anyone can use to view this list.
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors border border-stone-200"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
