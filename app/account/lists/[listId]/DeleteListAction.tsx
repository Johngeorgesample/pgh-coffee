'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

interface DeleteListActionProps {
  listId: string
  listName: string
}

export default function DeleteListAction({ listId, listName }: DeleteListActionProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/lists/${listId}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete list')

      router.push('/account/lists')
    } catch (err) {
      console.error('Failed to delete list:', err)
      setDeleting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-red-50 text-stone-600 hover:text-red-600 border border-stone-200 hover:border-red-200 transition-colors"
        aria-label="Delete list"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-w-lg w-full bg-white rounded-xl p-6 shadow-xl">
            <DialogTitle className="text-lg font-semibold text-stone-900 mb-4">
              Delete list
            </DialogTitle>
            <div className="space-y-4">
              <p className="text-sm text-stone-600">
                Are you sure you want to delete <strong>{listName}</strong>? This action cannot be
                undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
