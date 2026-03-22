'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { X } from 'lucide-react'
import SaveModalListItem from './SaveModalListItem'
import CreateListButton from './CreateListButton'

interface ListWithStatus {
  id: string
  name: string
  created_at: string
  has_shop: boolean
}

interface Props {
  isOpen: boolean
  onClose: () => void
  shopUUID: string
  shopName: string
}

export default function SaveModal({ isOpen, onClose, shopUUID, shopName }: Props) {
  const [lists, setLists] = useState<ListWithStatus[]>([])
  const [selectedLists, setSelectedLists] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchLists = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/lists/status/${shopUUID}`)
      if (!response.ok) throw new Error('Failed to fetch lists')
      const data: ListWithStatus[] = await response.json()
      setLists(data)
      setSelectedLists(data.filter(list => list.has_shop).map(list => list.id))
    } catch (error) {
      console.error('Error fetching lists:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isOpen) return
    fetchLists()
  }, [isOpen, shopUUID])

  const addShopToList = async (listId: string, shopUUID: string) => {
    const res = await fetch(`/api/lists/${listId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shop_id: shopUUID }),
    })

    if (!res.ok) {
      const { error } = await res.json()
      throw new Error(error)
    }

    return res.json()
  }

  const removeShopFromList = async (listId: string, shopUUID: string) => {
    const res = await fetch(`/api/lists/${listId}/items/${shopUUID}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      const { error } = await res.json()
      throw new Error(error)
    }

    return res.json()
  }

  const handleClick = (id: string) => {
    const isCurrentlySelected = selectedLists.includes(id)
    setSelectedLists(prev => (isCurrentlySelected ? prev.filter(item => item !== id) : [...prev, id]))

    if (isCurrentlySelected) {
      removeShopFromList(id, shopUUID)
    } else {
      addShopToList(id, shopUUID)
    }
  }

  const handleAddingToNewList = async (newListId: string) => {
    await addShopToList(newListId, shopUUID)
    fetchLists()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-end sm:items-center justify-center sm:p-4">
        <DialogPanel className="relative w-full sm:max-w-md bg-stone-50 sm:rounded-3xl rounded-t-3xl px-6 pt-5 pb-8 sm:pb-6 shadow-2xl">
          {/* drag handle on mobile */}
          <div className="sm:hidden w-10 h-1 bg-stone-300 rounded-full mx-auto mb-5" />

          <DialogTitle as="div" className="flex items-start justify-between mb-5">
            <div>
              <p className="font-semibold text-stone-900 text-base tracking-tight">Save to list</p>
              <p className="text-stone-400 text-sm mt-0.5 truncate max-w-[260px]">{shopName}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-3 mt-0.5 p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-200 transition-colors shrink-0"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </DialogTitle>

          <ul className="flex flex-col max-h-[38dvh] gap-1 overflow-y-auto -mx-1 px-1 mb-4">
            {isLoading ? (
              <li className="py-6 text-center text-stone-400 text-sm">Loading...</li>
            ) : lists.length === 0 ? (
              <li className="py-6 text-center text-stone-400 text-sm">No lists yet</li>
            ) : (
              lists.map(list => (
                <SaveModalListItem
                  key={list.id}
                  name={list.name}
                  count=""
                  id={list.id}
                  isSelected={selectedLists.includes(list.id)}
                  onClick={handleClick}
                />
              ))
            )}
          </ul>

          <div className="border-t border-stone-200 pt-4 space-y-3">
            <CreateListButton onAdd={handleAddingToNewList} />
            {selectedLists.length > 0 && (
              <p className="text-center text-xs text-stone-400">
                Saved to {selectedLists.length} {selectedLists.length === 1 ? 'list' : 'lists'}
              </p>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
