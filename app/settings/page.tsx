'use client'

import { useState, useSyncExternalStore } from 'react'
import { TUnits } from '@/types/unit-types'
import DistanceUnitsDialog from '@/app/settings/DistanceUnitsDialog'
import { DISTANCE_UNITS } from '@/app/utils/distance'

const DISTANCE_PREFERENCE_KEY = 'distanceUnits'
const DEFAULT_UNIT = DISTANCE_UNITS.Miles

function LoadingState() {
  return (
    <p className="text-gray-400" aria-label="Loading settings">
      Loading…
    </p>
  )
}

const subscribeToDistanceUnits = (callback: () => void) => {
  const handler = (event: StorageEvent) => {
    if (event.key === DISTANCE_PREFERENCE_KEY) callback()
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}

const getStoredUnit = (): TUnits | null => {
  if (typeof window === 'undefined') return null
  const value = window.localStorage.getItem(DISTANCE_PREFERENCE_KEY)
  return value as TUnits | null
}

const getServerStoredUnit = (): TUnits | null => null

export default function Settings() {
  const [distanceUnitsDialogIsOpen, setDistanceUnitsDialogIsOpen] = useState(false)
  const [overrideUnit, setOverrideUnit] = useState<TUnits | null>(null)
  const externalStoredUnit = useSyncExternalStore(
    subscribeToDistanceUnits,
    getStoredUnit,
    getServerStoredUnit,
  )

  const isHydrated = typeof window !== 'undefined'
  const effectiveUnit = overrideUnit ?? externalStoredUnit ?? DEFAULT_UNIT
  const isLoading = !isHydrated

  const handleUnitChange = (newUnit: string) => {
    try {
      window.localStorage.setItem(DISTANCE_PREFERENCE_KEY, newUnit)
      setOverrideUnit(newUnit as TUnits)
    } catch (error) {
      console.error('Failed to save unit preference:', error)
    }
  }

  const handleOpenDialog = () => {
    if (typeof window !== 'undefined' && !window.localStorage.getItem(DISTANCE_PREFERENCE_KEY)) {
      window.localStorage.setItem(DISTANCE_PREFERENCE_KEY, DEFAULT_UNIT)
    }
    setDistanceUnitsDialogIsOpen(true)
  }

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
                {isLoading ? <LoadingState /> : <div className="text-gray-900">{effectiveUnit}</div>}
                <button
                  aria-label="Update distance units"
                  className="font-semibold text-slate-700 hover:text-slate-500"
                  onClick={handleOpenDialog}
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
        currentUnit={effectiveUnit}
        isOpen={distanceUnitsDialogIsOpen}
        handleClose={() => setDistanceUnitsDialogIsOpen(false)}
        onUnitChange={handleUnitChange}
      />
    </>
  )
}
