'use client'

// PROTOTYPE, throwaway: how the map chips behave on mobile when the sheet is open.
// A = chips fade out when the sheet is fully expanded
// B = chips move into the sheet, under the search bar
// C = expanded sheet grows to cover the chips

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { create } from 'zustand'

export const VARIANTS = {
  A: 'Hide when expanded',
  B: 'Chips in sheet',
  C: 'Sheet covers chips',
} as const
type TVariant = keyof typeof VARIANTS
const KEYS = Object.keys(VARIANTS) as TVariant[]

export function useChipsVariant() {
  const v = useSearchParams().get('variant') as TVariant | null
  return v && v in VARIANTS ? v : 'A'
}

export const useSheetExpanded = create<{ expanded: boolean; setExpanded: (e: boolean) => void }>(set => ({
  expanded: false,
  setExpanded: expanded => set({ expanded }),
}))

export function PrototypeSwitcher() {
  const router = useRouter()
  const params = useSearchParams()
  const current = useChipsVariant()
  const expanded = useSheetExpanded(s => s.expanded)

  const go = (step: number) => {
    const next = KEYS[(KEYS.indexOf(current) + step + KEYS.length) % KEYS.length]
    const p = new URLSearchParams(params.toString())
    p.set('variant', next)
    router.replace(`?${p.toString()}`)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, [contenteditable]')) return
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className="fixed bottom-4 left-1/2 z-[9999] flex -translate-x-1/2 items-center gap-3 rounded-full bg-fuchsia-700 px-3 py-1.5 text-sm font-mono text-white shadow-xl">
      <button type="button" onClick={() => go(-1)}>&larr;</button>
      <span>{current} ({VARIANTS[current]}) · {expanded ? 'full' : 'mid'}</span>
      <button type="button" onClick={() => go(1)}>&rarr;</button>
    </div>
  )
}
