'use client'

import { Share2, Pencil, Trash2 } from 'lucide-react'

interface ListActionsProps {
  onShare: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function ListActions({ onShare, onEdit, onDelete }: ListActionsProps) {
  const buttonClass =
    'inline-flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-800 border border-stone-200 transition-colors'

  return (
    <div className="flex items-center gap-2">
      <button onClick={onShare} className={buttonClass} aria-label="Share list">
        <Share2 className="w-4 h-4" />
      </button>
      <button onClick={onEdit} className={buttonClass} aria-label="Edit list">
        <Pencil className="w-4 h-4" />
      </button>
      <button
        onClick={onDelete}
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-red-50 text-stone-600 hover:text-red-600 border border-stone-200 hover:border-red-200 transition-colors"
        aria-label="Delete list"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
