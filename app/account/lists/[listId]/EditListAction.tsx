'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

const buttonClass =
  'inline-flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-800 border border-stone-200 transition-colors'

interface EditListActionProps {
  listId: string
  currentName: string
  onUpdate: (newName: string) => void
}

export default function EditListAction({ listId, currentName, onUpdate }: EditListActionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(currentName)
  const [saving, setSaving] = useState(false)

  const handleOpen = () => {
    setName(currentName)
    setIsOpen(true)
  }

  const handleSave = async () => {
    if (!name.trim() || name === currentName) {
      setIsOpen(false)
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/lists/${listId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })

      if (!res.ok) throw new Error('Failed to update list')

      onUpdate(name.trim())
      setIsOpen(false)
    } catch (err) {
      console.error('Failed to update list:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <button onClick={handleOpen} className={buttonClass} aria-label="Edit list">
        <Pencil className="w-4 h-4" />
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-w-lg w-full bg-white rounded-xl p-6 shadow-xl">
            <DialogTitle className="text-lg font-semibold text-stone-900 mb-4">
              Edit list name
            </DialogTitle>
            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-800"
                placeholder="List name"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving || !name.trim()}
                  className="flex-1 bg-stone-800 hover:bg-stone-700 disabled:bg-stone-400 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  {saving ? 'Saving...' : 'Save'}
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
