'use client'

import { Stamp } from 'lucide-react'
import useShopsStore from '@/stores/coffeeShopsStore'
import MapChip from './MapChip'

export default function PassportToggle() {
  const visitedCount = useShopsStore(s => s.visitedUUIDs?.size ?? 0)
  const totalCount = useShopsStore(s => s.allShops.features.length)
  const passportMode = useShopsStore(s => s.passportMode)
  const setPassportMode = useShopsStore(s => s.setPassportMode)

  if (visitedCount === 0) return null

  return (
    <MapChip on={passportMode} onClick={() => setPassportMode(!passportMode)}>
      <Stamp className={`size-4 transition-colors ${passportMode ? 'fill-green-500 text-green-800' : 'text-stone-500'}`} />
      Passport
      <span className={`tabular-nums transition-colors ${passportMode ? 'text-stone-700' : 'text-stone-500'}`}>
        {visitedCount}/{totalCount}
      </span>
    </MapChip>
  )
}
