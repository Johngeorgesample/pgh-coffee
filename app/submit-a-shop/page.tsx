'use client'

import { useRef, useEffect, useState } from 'react'
import { PhotoIcon } from '@heroicons/react/24/solid'
import SuccessDialog from './SuccessDialog'

export default function SubmitAShop() {
  const [successDialogIsOpen, setSuccessDialogIsOpen] = useState(false)

  const submitForm = useRef(null)
  async function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const data = Object.fromEntries(formData.entries())
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
      } else {
        setSuccessDialogIsOpen(true)
        // @ts-ignore-next-line
        submitForm.current?.reset()
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
                Either one that&apos;s missing or a correction for an existing one
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
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm sm:leading-6"
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
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm sm:leading-6"
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
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm sm:leading-6"
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
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className="rounded-md bg-yellow-300 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      <SuccessDialog
        isOpen={successDialogIsOpen}
        handleClose={() => setSuccessDialogIsOpen(false)}
      />
    </>
  )
}