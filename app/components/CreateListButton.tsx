'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

interface CreateListButtonProps {
  onAdd: (newListId: string) => void
}

export default function CreateListButton({ onAdd }: CreateListButtonProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [listName, setListName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isValid = listName.trim().length > 0

  const handleCancel = () => {
    setListName('')
    setIsEditing(false)
  }

  const createList = async () => {
    if (!isValid || isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: listName.trim() }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create list')
      }

      const newList = await response.json()
      setListName('')
      setIsEditing(false)
      onAdd(newList.id)
    } catch (error) {
      console.error('Error creating list:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {isEditing ? (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-yellow-400 bg-amber-50">
          <input
            autoFocus
            className="flex-1 bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
            onChange={e => setListName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createList()}
            placeholder="List name"
            value={listName}
          />
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-3 py-1 text-sm rounded-lg text-stone-500 hover:bg-stone-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={createList}
            disabled={!isValid || isSubmitting}
            className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
              isValid && !isSubmitting
                ? 'bg-yellow-400 text-stone-800 hover:bg-yellow-500'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
        </div>
      ) : (
        <button
          className="group flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-xl border-2 border-dashed border-stone-200 hover:border-yellow-400 hover:bg-amber-50 transition-all duration-150"
          onClick={() => setIsEditing(true)}
        >
          <div className="p-2 rounded-lg bg-stone-200 text-stone-500 group-hover:bg-yellow-400 group-hover:text-white transition-colors duration-150">
            <Plus size={16} />
          </div>
          <p className="text-sm text-stone-500 group-hover:text-stone-700 transition-colors">New list</p>
        </button>
      )}
    </>
  )
}
