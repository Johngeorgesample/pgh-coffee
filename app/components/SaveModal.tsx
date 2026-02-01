'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
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

  useEffect(() => {
    if (!isOpen) return

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

  const handleClick = (id: string) => {
    setSelectedLists(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]))
    addShopToList(id, shopUUID)
  }

  const handleAddingToNewList = () => {
    console.log('handleAddingToNewList')
    // TODO: POST request to create new list and add shop
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative max-w-md w-full bg-white rounded-xl p-5 shadow-xl">
          <DialogTitle>
            <div className="h-18 border-b -mx-6 px-6">
              <p className="font-bold">Save to list</p>
              <p>{shopName}</p>
            </div>
          </DialogTitle>

          <ul className="flex flex-col py-2 max-h-[35dvh] gap-1 overflow-scroll">
            {isLoading ? (
              <li className="py-4 text-center text-slate-500">Loading...</li>
            ) : lists.length === 0 ? (
              <li className="py-4 text-center text-slate-500">No lists yet</li>
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
          <div className="border-t -mx-6 px-6 pt-4">
            <CreateListButton onAdd={handleAddingToNewList} />
            <p className="text-center text-xs mt-4">Saved to {selectedLists.length} lists</p>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
