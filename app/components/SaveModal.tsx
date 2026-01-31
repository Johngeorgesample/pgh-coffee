'use client'
import { useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Bookmark } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  shopName: string
}

export default function IssueModal({ isOpen, onClose, shopName }: Props) {
  const [selectedLists, setSelectedLists] = useState<string[]>([])

  const handleClick = (id: string) => {
    setSelectedLists(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]))
  }

  const ListItem = ({ name, count, id }: { name: string; count: string; id: string }) => {
    const isSelected = selectedLists.includes(id)
    return (
      <li
        className={`flex gap-2 py-2 ${isSelected ? 'bg-red-100 ' : 'hover:bg-slate-100 '}`}
        onClick={() => handleClick(id)}
      >
        <div className="flex items-center">
          <div className="bg-slate-200 p-2 rounded-lg">
            <Bookmark />
          </div>
        </div>
        <div className="flex flex-col">
          <p>{name}</p>
          <p className="text-slate-500 text-xs">{count} shops</p>
        </div>
      </li>
    )
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
            {data.map(list => {
              return <ListItem key={list.id} name={list.name} count={list.count} id={list.id} />
            })}
          </ul>
          <div className="border-t -mx-6 px-6 pt-4">
            <div className="flex gap-2 border border-dashed p-2">
              <p>+</p>
              <p>Create new list</p>
            </div>
            <p className="text-center text-xs mt-4">Saved to {selectedLists.length} lists</p>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
