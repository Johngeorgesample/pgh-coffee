'use client'

import { useState } from 'react'

import { Checkbox, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { amenityMap } from './AmenityChip'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  amenities: string[]
  shopId: string
}

export default function AmenityReportModal({ isOpen, onClose, onSuccess, amenities, shopId }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          as="form"
          onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const selected = formData.getAll('amenities') as string[]
            setIsSubmitting(true)
            try {
              const res = await fetch('/api/shops/report-amenities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shop_id: shopId, amenities: selected }),
              })
              if (!res.ok) throw new Error('Failed to submit')
              onSuccess()
              onClose()
            } catch (err) {
              console.error('Error submitting amenity report:', err)
            } finally {
              setIsSubmitting(false)
            }
          }}
          className="relative max-w-md w-full bg-white rounded-xl p-6 shadow-xl"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <DialogTitle className="text-lg font-semibold text-stone-900 mb-2">What&apos;s here?</DialogTitle>
          <div className="grid grid-cols-2">
            {Object.entries(amenityMap).map(([key, { label, icon: Icon }]) => (
              <div key={key} className="flex items-center gap-2 py-1">
                <Checkbox
                  defaultChecked={amenities.includes(key)}
                  name="amenities"
                  value={key}
                  className="group block size-4 rounded border bg-white data-checked:bg-blue-500"
                >
                  <svg
                    className="stroke-white opacity-0 group-data-checked:opacity-100"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Checkbox>
                <Icon size={16} strokeWidth={2} className="text-stone-500" />
                <span className="text-sm text-stone-700">{label}</span>
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-lg mt-6 py-3 px-4 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 ${
              isSubmitting ? 'bg-yellow-100 cursor-not-allowed' : 'bg-yellow-300 hover:bg-yellow-400'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
