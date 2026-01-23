'use client'

import { useRef, useState } from 'react'
import { TShop } from '@/types/shop-types'
import SuccessDialog from '@/app/submit-a-shop/SuccessDialog'

interface IProps {
  shop: TShop
}

export default function IssueForm(props: IProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successDialogIsOpen, setSuccessDialogIsOpen] = useState(false)
  const [neighborhoodValue, setNeighborhoodValue] = useState(props.shop.properties.neighborhood)
  const submitForm = useRef<HTMLFormElement>(null)

  async function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)

    const data = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      neighborhood: neighborhoodValue,
      website: formData.get('website') as string,
    }

    try {
      const response = await fetch('/api/issue/', {
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
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-6 pb-20">
      <div className="md:pt-4">
        <form onSubmit={handleForm} ref={submitForm} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={props.shop.properties.name}
              className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-2">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              defaultValue={props.shop.properties.address}
              className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-900 mb-2">
              Neighborhood
            </label>
            <input
              id="neighborhood"
              name="neighborhood"
              type="text"
              defaultValue={props.shop.properties.neighborhood}
              className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm"
            />
          </div>


          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-900 mb-2">
              Website
            </label>
            <input
              id="website"
              name="website"
              type="text"
              defaultValue={props.shop.properties.website}
              className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-lg py-3 px-4 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 ${
              isSubmitting ? 'bg-yellow-100 cursor-not-allowed' : 'bg-yellow-300 hover:bg-yellow-400'
            }`}
          >
            {isSubmitting ? 'Reporting...' : 'Report an issue'}
          </button>
        </form>
      </div>

      <SuccessDialog isOpen={successDialogIsOpen} handleClose={() => setSuccessDialogIsOpen(false)} />
    </section>
  )
}
