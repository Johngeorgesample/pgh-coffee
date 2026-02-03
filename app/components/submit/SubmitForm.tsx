'use client'

import { useRef, useState } from 'react'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { neighborhoods } from '@/data/neighborhoods'
import SuccessDialog from '@/app/submit-a-shop/SuccessDialog'
import { InfoIcon } from 'lucide-react'

interface IShopSubmission {
  name: string
  address: string
  neighborhood?: string
  website?: string
}

export default function SubmitForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successDialogIsOpen, setSuccessDialogIsOpen] = useState(false)
  const [neighborhoodValue, setNeighborhoodValue] = useState('')
  const [query, setQuery] = useState('')

  const submitForm = useRef<HTMLFormElement>(null)

  const filteredNeighborhoods =
    query === ''
      ? neighborhoods
      : neighborhoods.filter(neighborhood => neighborhood.toLowerCase().includes(query.toLowerCase()))

  async function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)

    const data: IShopSubmission = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      neighborhood: neighborhoodValue,
      website: formData.get('website') as string,
    }

    try {
      const response = await fetch('/api/shops/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorResponse = await response.json()
        console.error('Error:', errorResponse.error)
        setIsSubmitting(false)
      } else {
        setSuccessDialogIsOpen(true)
        submitForm.current?.reset()
        setNeighborhoodValue('')
        setQuery('')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-6 pb-20">
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-2xl mx-auto">
        <form onSubmit={handleForm} ref={submitForm} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
              Shop name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              required
              type="text"
              className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              name="address"
              required
              type="text"
              className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm"
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="w-full">
              <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-900 mb-2">
                Neighborhood
              </label>
              <Combobox
                value={neighborhoodValue}
                onChange={(value: string) => {
                  setNeighborhoodValue(value)
                  setQuery('')
                }}
                onClose={() => setQuery('')}
              >
                <div className="relative">
                  <ComboboxInput
                    id="neighborhood"
                    name="neighborhood"
                    className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm"
                    displayValue={(value: string) => value}
                    onChange={event => {
                      setQuery(event.target.value)
                      setNeighborhoodValue(event.target.value)
                    }}
                  />
                  {filteredNeighborhoods.length > 0 && query !== '' && (
                    <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {filteredNeighborhoods.map(neighborhood => (
                        <ComboboxOption
                          key={neighborhood}
                          value={neighborhood}
                          className="relative cursor-pointer select-none py-2 px-4 data-[focus]:bg-yellow-100 data-[selected]:bg-yellow-200"
                        >
                          {neighborhood}
                        </ComboboxOption>
                      ))}
                    </ComboboxOptions>
                  )}
                </div>
              </Combobox>
            </div>

            <div className="w-full">
              <label htmlFor="website" className="block text-sm font-medium text-gray-900 mb-2">
                Website
              </label>
              <input
                id="website"
                name="website"
                type="url"
                className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <InfoIcon aria-hidden="true" className="w-4 h-4 shrink-0 mt-0.5 text-yellow-400" />
            <p className="text-sm text-slate-600">
              I currently only list shops located within Allegheny County, but I&apos;m tracking interest in the greater Pittsburgh area for future expansion. Chains or franchises headquartered elsewhere
              are not included to maintain the focus on local independent businesses.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-lg py-3 px-4 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 ${
              isSubmitting ? 'bg-yellow-100 cursor-not-allowed' : 'bg-yellow-300 hover:bg-yellow-400'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit shop'}
          </button>
        </form>
      </div>

      <SuccessDialog isOpen={successDialogIsOpen} handleClose={() => setSuccessDialogIsOpen(false)} />
    </section>
  )
}
