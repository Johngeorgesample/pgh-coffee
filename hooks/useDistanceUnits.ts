import { useEffect, useState } from 'react'
import { DEFAULT_UNITS, DISTANCE_UNITS_STORAGE_KEY, parseUnits, TUnits } from '@/types/unit-types'

export function useDistanceUnits() {
  const [units, setUnits] = useState<TUnits>(DEFAULT_UNITS)
  useEffect(() => {
    setUnits(parseUnits(localStorage.getItem(DISTANCE_UNITS_STORAGE_KEY)))
  }, [])
  return units
}
