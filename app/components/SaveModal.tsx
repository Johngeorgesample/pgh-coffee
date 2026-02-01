'use client'

import { useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import SaveModalListItem from './SaveModalListItem'
import CreateListButton from './CreateListButton'

interface Props {
  isOpen: boolean
  onClose: () => void
  shopName: string
}

export default function SaveModal({ isOpen, onClose, shopName }: Props) {
  const [selectedLists, setSelectedLists] = useState<string[]>([])

  const handleClick = (id: string) => {
    setSelectedLists(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]))
  }

  const data = [
    { name: 'Favorites', count: '3', id: '1' },
    { name: 'Date night spots', count: '3', id: '2' },
    { name: 'Foo', count: '3', id: '3' },
    { name: 'Bar', count: '3', id: '4' },
    { name: 'Baz', count: '3', id: '5' },
  ]

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

          <ul className="py-2 max-h-[35dvh] overflow-scroll">
            {data.map(list => (
              <SaveModalListItem
                key={list.id}
                name={list.name}
                count={list.count}
                id={list.id}
                isSelected={selectedLists.includes(list.id)}
                onClick={handleClick}
              />
            ))}
          </ul>
          <div className="border-t -mx-6 px-6 pt-4">
            <CreateListButton />
            <p className="text-center text-xs mt-4">Saved to {selectedLists.length} lists</p>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
