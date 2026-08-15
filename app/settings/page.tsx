'use client'

import { useEffect, useState } from 'react'
import { TUnits } from '@/types/unit-types'
import DistanceUnitsDialog, { DISTANCE_UNITS } from '@/app/settings/DistanceUnitsDialog'

const DISTANCE_PREFERENCE_KEY = 'distanceUnits'
const DEFAULT_UNIT = DISTANCE_UNITS.Miles as TUnits

// A storage write can throw (e.g. private browsing with storage disabled), and
// this seed is a best-effort default, not the read path — swallow it the same
// way handleUnitChange already does, rather than let it fail the mount effect.
const seedDefaultUnit = () => {
  try {
    window.localStorage.setItem(DISTANCE_PREFERENCE_KEY, DEFAULT_UNIT)
  } catch (error) {
    console.error('Failed to seed default unit preference:', error)
  }
}

// Read once and reuse the same value for both the write and the state, so a
// first visit (nothing stored yet) can't leave localStorage and the render
// disagreeing about what the default is. One `stored` check drives both
// branches, so an empty string is treated as "nothing stored" everywhere,
// not just in the write, or it would render blank forever without self-healing.
const readStoredUnitOrSeedDefault = () => {
  const stored = window.localStorage.getItem(DISTANCE_PREFERENCE_KEY)
  if (stored) return stored as TUnits
  seedDefaultUnit()
  return DEFAULT_UNIT
}

export default function Settings() {
  const [distanceUnitsDialogIsOpen, setDistanceUnitsDialogIsOpen] = useState(false)
  const [unitFromLocalStorage, setUnitFromLocalStorage] = useState<TUnits>('miles')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setUnitFromLocalStorage(readStoredUnitOrSeedDefault())
    setIsLoading(false)
  }, [])

  const handleUnitChange = (newUnit: string) => {
    try {
      window.localStorage.setItem(DISTANCE_PREFERENCE_KEY, newUnit)
      setUnitFromLocalStorage(newUnit as TUnits)
    } catch (error) {
      console.error('Failed to save unit preference:', error)
    }
  }

  const LoadingState = () => (
    <p className="text-gray-400" aria-label="Loading settings">
      Loading...
    </p>
  )

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 md:px-8 mt-16">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Settings</h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Adjust your preferences to customize the experience across the entire application
          </p>
          <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Units for distance</dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                {isLoading ? <LoadingState /> : <div className="text-gray-900">{unitFromLocalStorage}</div>}
                <button
                  aria-label="Update distance units"
                  className="font-semibold text-slate-700 hover:text-slate-500"
                  onClick={() => setDistanceUnitsDialogIsOpen(true)}
                  type="button"
                >
                  Update
                </button>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <DistanceUnitsDialog
        currentUnit={unitFromLocalStorage}
        isOpen={distanceUnitsDialogIsOpen}
        handleClose={() => setDistanceUnitsDialogIsOpen(false)}
        onUnitChange={handleUnitChange}
      />
    </>
  )
}
