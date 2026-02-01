'use client'

import { Bookmark } from 'lucide-react'

interface SaveModalListItemProps {
  name: string
  count: string
  id: string
  isSelected: boolean
  onClick: (id: string) => void
}

export default function SaveModalListItem({ name, count, id, isSelected, onClick }: SaveModalListItemProps) {
  return (
    <li
      className={`flex gap-2 py-2 ${isSelected ? 'bg-yellow-200 ' : 'hover:bg-slate-100 '}`}
      onClick={() => onClick(id)}
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
