'use client'

import { useState } from 'react'
import { TShop } from '@/types/shop-types'
import { getFaro } from '@/lib/faro'
import { REPORT_TYPES, ReportType } from '@/lib/reportTypes'

interface IProps {
  shop: TShop
  onSuccess: () => void
}

const inputClasses =
  'block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm'

const DETAILS_PLACEHOLDER: Record<string, string> = {
  hours: 'e.g. Closes at 3pm on Sundays, not 6pm',
  other: 'What should we know?',
}

export default function IssueForm({ shop, onSuccess }: IProps) {
  const [reportType, setReportType] = useState<ReportType>('hours')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requires = REPORT_TYPES[reportType].requires

  async function postReport(payload: Record<string, unknown>) {
    const response = await fetch('/api/shops/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
  }

  async function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)

    if (requires && !String(formData.get(requires) ?? '').trim()) {
      setError('Please tell us what to fix.')
      return
    }

    setIsSubmitting(true)
    try {
      await postReport({
        shop_id: shop.properties.uuid,
        report_type: reportType,
        details: formData.get('details') || null,
        reported_website: formData.get('reported_website') || null,
      })
      getFaro()?.api.pushEvent('shop_reported', { shop_id: shop.properties.uuid, report_type: reportType })
      onSuccess()
    } catch (err) {
      console.error('Error submitting report:', err)
      setError('Something went wrong submitting your report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleForm} className="space-y-5">
      <fieldset>
        <legend className="sr-only">What&apos;s wrong?</legend>
        <div className="space-y-2">
          {Object.entries(REPORT_TYPES).map(([value, { label }]) => (
            <label key={value} className="flex items-center gap-3 text-sm text-gray-900">
              <input
                type="radio"
                name="report_type"
                value={value}
                checked={reportType === value}
                onChange={() => setReportType(value as ReportType)}
                className="size-4 border-gray-300 text-yellow-400 focus:ring-yellow-400"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {requires === 'details' && (
        <div>
          <label htmlFor="details" className="block text-sm font-medium text-gray-900 mb-2">
            Details
          </label>
          <textarea
            id="details"
            name="details"
            rows={3}
            placeholder={DETAILS_PLACEHOLDER[reportType]}
            className={inputClasses}
          />
        </div>
      )}

      {requires === 'reported_website' && (
        <div>
          <label htmlFor="reported_website" className="block text-sm font-medium text-gray-900 mb-2">
            Website
          </label>
          <input
            id="reported_website"
            name="reported_website"
            type="url"
            defaultValue={shop.properties.website ?? ''}
            className={inputClasses}
          />
        </div>
      )}

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full rounded-lg py-3 px-4 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 ${
          isSubmitting ? 'bg-yellow-100 cursor-not-allowed' : 'bg-yellow-300 hover:bg-yellow-400'
        }`}
      >
        {isSubmitting ? 'Submitting…' : 'Submit'}
      </button>
    </form>
  )
}
