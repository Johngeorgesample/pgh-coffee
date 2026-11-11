'use client'

import { Stamp } from 'lucide-react'
import useShopsStore from '@/stores/coffeeShopsStore'

export default function PassportToggle() {
  const visitedCount = useShopsStore(s => s.visitedUUIDs?.size ?? 0)
  const totalCount = useShopsStore(s => s.allShops.features.length)
  const passportMode = useShopsStore(s => s.passportMode)
  const setPassportMode = useShopsStore(s => s.setPassportMode)

  if (visitedCount === 0) return null

  return (
    <button
      type="button"
      role="switch"
      aria-checked={passportMode}
      onClick={() => setPassportMode(!passportMode)}
      className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-medium text-stone-800 shadow-lg transition ease-out hover:bg-stone-50 active:scale-95"
    >
      <Stamp className={`size-4 transition-colors ${passportMode ? 'fill-green-500 text-white' : 'text-stone-500'}`} />
      Passport
      {passportMode ? (
        <span className="inline-flex items-center gap-1.5 tabular-nums text-stone-500">
          <span aria-hidden="true" className="size-2 rounded-full bg-yellow-300 ring-1 ring-yellow-500" />
          {visitedCount} of {totalCount} visited
        </span>
      ) : (
        <span className="tabular-nums text-stone-500">
          {visitedCount}/{totalCount}
        </span>
      )}
    </button>
  )
}
