'use client'

import { useState } from 'react'
import { TShop } from '@/types/shop-types'

interface IProps {
  shop: TShop
  onSuccess: () => void
}

export default function IssueForm({ shop, onSuccess }: IProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)

    const data = {
      shop_id: shop.properties.uuid,
      reported_name: formData.get('name') as string,
      reported_address: formData.get('address') as string,
      reported_neighborhood: formData.get('neighborhood') as string,
      reported_website: formData.get('website') as string,
    }

    try {
      const response = await fetch('/api/shops/report', {
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
        setIsSubmitting(false)
        onSuccess()
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-6 pb-20">
      <div className="md:pt-4">
        <form onSubmit={handleForm} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={shop.properties.name}
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
              defaultValue={shop.properties.address}
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
              defaultValue={shop.properties.neighborhood}
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
              defaultValue={shop.properties.website}
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
    </section>
  )
}
