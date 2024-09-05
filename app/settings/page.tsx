'use client'

import { useState } from 'react'
import Nav from '@/app/components/Nav'
import DistanceUnitsDialog from '@/app/settings/DistanceUnitsDialog'
export default function Settings() {
  const [distanceUnitsDialogIsOpen, setDistanceUnitsDialogIsOpen] = useState(false)

  const units = localStorage.getItem('distanceUnits')

  return (
    <>
      <Nav />
      <div className="max-w-4xl mx-auto px-6 md:px-8 mt-16">
        <div> <h2 className="text-base font-semibold leading-7 text-gray-900">Settings</h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            This information will be displayed publicly so be careful what you share.
          </p>

          <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Units for distance</dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">{units}</div>
                <button onClick={() => setDistanceUnitsDialogIsOpen(true)} type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Update
                </button>
              </dd>
            </div>
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">How close is &quot;nearby&quot;?</dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">&lt;1000 meters</div>
                <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Update
                </button>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <DistanceUnitsDialog isOpen={distanceUnitsDialogIsOpen} handleClose={() => setDistanceUnitsDialogIsOpen(false)}  />
    </>
  )
}
