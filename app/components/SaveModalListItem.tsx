'use client'

import { Bookmark, Check } from 'lucide-react'

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
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 select-none ${
        isSelected
          ? 'bg-amber-50 border border-amber-200'
          : 'border border-transparent hover:bg-stone-100'
      }`}
      onClick={() => onClick(id)}
    >
      <div
        className={`p-2 rounded-lg shrink-0 transition-colors duration-150 ${
          isSelected ? 'bg-yellow-400 text-white' : 'bg-stone-200 text-stone-500'
        }`}
      >
        {isSelected ? <Check size={16} /> : <Bookmark size={16} />}
      </div>
      <div className="flex flex-col min-w-0">
        <p className={`text-sm font-medium truncate ${isSelected ? 'text-stone-900' : 'text-stone-700'}`}>{name}</p>
        {count && <p className="text-stone-400 text-xs">{count} shops</p>}
      </div>
    </li>
  )
}
