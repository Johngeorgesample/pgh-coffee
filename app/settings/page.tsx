'use client'

import { useEffect, useState } from 'react'
import { DEFAULT_UNITS, DISTANCE_UNITS_STORAGE_KEY, parseUnits, TUnits } from '@/types/unit-types'
import DistanceUnitsDialog from '@/app/settings/DistanceUnitsDialog'

export default function Settings() {
  const [distanceUnitsDialogIsOpen, setDistanceUnitsDialogIsOpen] = useState(false)
  const [unitFromLocalStorage, setUnitFromLocalStorage] = useState<TUnits>(DEFAULT_UNITS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setUnitFromLocalStorage(parseUnits(window.localStorage.getItem(DISTANCE_UNITS_STORAGE_KEY)))
    setIsLoading(false)
  }, [])

  const handleUnitChange = (newUnit: TUnits) => {
    try {
      window.localStorage.setItem(DISTANCE_UNITS_STORAGE_KEY, newUnit)
      setUnitFromLocalStorage(newUnit)
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
