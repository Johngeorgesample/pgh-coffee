'use client'

import { useRef, useState } from 'react'
import SuccessDialog from './SuccessDialog'

interface IShopSubmission {
  name: string
  address: string
  neighborhood?: string
  website?: string
}

export default function SubmitAShop() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successDialogIsOpen, setSuccessDialogIsOpen] = useState(false)

  const submitForm = useRef<HTMLFormElement>(null)
  async function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)

    const data: IShopSubmission = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      neighborhood: formData.get('neighborhood') as string,
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
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    }
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 md:px-8 mt-16">
        <form onSubmit={handleForm} ref={submitForm}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Submit a shop</h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                pgh.coffee highlights independently owned coffee shops headquartered or founded in the Pittsburgh
                region. We currently only list shops located within Allegheny County. Chains or franchises headquartered
                elsewhere are not included.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    Shop name
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      required
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                    Address
                  </label>
                  <div className="mt-2">
                    <input
                      id="address"
                      name="address"
                      required
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="neighborhood" className="block text-sm font-medium leading-6 text-gray-900">
                    Neighborhood
                  </label>
                  <div className="mt-2">
                    <input
                      id="neighborhood"
                      name="neighborhood"
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="website" className="block text-sm font-medium leading-6 text-gray-900">
                    Website
                  </label>
                  <div className="mt-2">
                    <input
                      id="website"
                      name="website"
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className={`rounded-md px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 ${
                isSubmitting ? 'bg-yellow-100 cursor-not-allowed' : 'bg-yellow-300 hover:bg-yellow-400'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      <SuccessDialog isOpen={successDialogIsOpen} handleClose={() => setSuccessDialogIsOpen(false)} />
    </>
  )
}
