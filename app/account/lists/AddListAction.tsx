'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

interface AddListActionProps {
  onAdd: (list: { id: string; name: string }) => void
}

export default function AddListAction({ onAdd }: AddListActionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  const handleOpen = () => {
    setName('')
    setIsOpen(true)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })

      if (!res.ok) throw new Error('Failed to create list')

      const newList = await res.json()
      onAdd(newList)
      setIsOpen(false)
    } catch (err) {
      console.error('Failed to create list:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="rounded-xl border-2 border-dashed border-stone-300 hover:border-amber-500 hover:bg-amber-50/50 transition-all duration-200 flex items-center justify-center gap-2 min-h-[106px] w-full text-stone-400 hover:text-amber-600"
      >
        <Plus className="w-5 h-5" />
        <span>Add list</span>
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-w-lg w-full bg-white rounded-xl p-6 shadow-xl">
            <DialogTitle className="text-lg font-semibold text-stone-900 mb-4">Create new list</DialogTitle>
            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-800"
                placeholder="List name"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving || !name.trim()}
                  className="flex-1 bg-stone-800 hover:bg-stone-700 disabled:bg-stone-400 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  {saving ? 'Creating...' : 'Create'}
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
