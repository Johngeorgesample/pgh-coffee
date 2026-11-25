'use client'

import { useState } from 'react'
import { JOURNAL_LIMITS } from '@/data/advent'

const OwnNote = ({ onAdd }: { onAdd: (note: string) => void }) => {
  const [draft, setDraft] = useState<string | null>(null)
  const commit = () => {
    onAdd(draft?.trim() ?? '')
    setDraft(null)
  }
  if (draft === null)
    return (
      <button
        type="button"
        onClick={() => setDraft('')}
        className="min-h-11 rounded-lg border-2 border-dashed border-gray-950/40 px-3.5 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-950"
      >
        + Add your own note
      </button>
    )
  return (
    <input
      ref={el => el?.focus()}
      value={draft}
      maxLength={JOURNAL_LIMITS.note}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={e => e.key === 'Enter' && commit()}
      aria-label="Add your own tasting note"
      placeholder="Dried cherry…"
      className="min-h-11 rounded-lg border-2 border-gray-950 px-3.5 text-base text-gray-950 sm:text-sm outline-none focus:border-gray-950 focus:bg-yellow-50 focus:ring-0"
    />
  )
}

export default OwnNote
