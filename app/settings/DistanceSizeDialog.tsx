'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

interface IProps {
  currentUnit: string
  handleClose: () => void
  isOpen: boolean
  onUnitChange: (newUnit: string) => void
}

export const DISTANCE_UNITS = { Meters: 'Meters', Miles: 'Miles' }

export default function DistanceSizeDialog(props: IProps) {
  const [selected, setSelected] = useState(props.currentUnit)

  useEffect(() => {
    if (props.isOpen) {
      setSelected(props.currentUnit)
    }
  }, [props.isOpen, props.currentUnit])

  const handleSave = () => {
    props.onUnitChange(selected)
    props.handleClose()
  }

  const handleUnitChange = (unit: string) => {
    setSelected(unit)
  }

  return (
    <Dialog open={props.isOpen} onClose={props.handleClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                    Unit size
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Used to show how close nearby shops are.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <input type="range" id="distance" name="distance" min="0" max="100" value="0" step="50" />
                <label for="distance">meters/miles</label>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:ml-3 sm:w-auto"
              >
                Save
              </button>
              <button
                type="button"
                onClick={props.handleClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
