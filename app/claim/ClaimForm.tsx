'use client'

import { useRef, useState } from 'react'
import ClaimSuccessDialog from './ClaimSuccessDialog'

interface TProps {
  shopId: string
  shopName: string
  neighborhood?: string
  companyName?: string
}

interface IClaimSubmission {
  shop_id: string
  contact_name: string
  role: string
  business_email: string
  phone: string
  social_media: string
  message: string
}

const inputClasses =
  'block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm'

const steps = [
  {
    title: 'Submit your details',
    body: 'Tell me who you are and how to reach you.',
  },
  {
    title: 'I verify by hand',
    body: 'I confirm ownership by hand, usually within a few days.',
  },
  {
    title: 'Get verified + early access',
    body: 'Your shop earns a verified badge, and you’ll be first to manage your own listing when self-serve editing launches.',
  },
]

export default function ClaimForm({ shopId, shopName, neighborhood, companyName }: TProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successDialogIsOpen, setSuccessDialogIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const claimForm = useRef<HTMLFormElement>(null)

  async function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    const formData = new FormData(event.currentTarget)

    const data: IClaimSubmission = {
      shop_id: shopId,
      contact_name: formData.get('contact_name') as string,
      role: formData.get('role') as string,
      business_email: formData.get('business_email') as string,
      phone: formData.get('phone') as string,
      social_media: formData.get('social_media') as string,
      message: formData.get('message') as string,
    }

    try {
      const response = await fetch('/api/shops/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => ({}))
        setError(errorResponse.error ?? 'Something went wrong. Please try again.')
        setIsSubmitting(false)
      } else {
        setSuccessDialogIsOpen(true)
        claimForm.current?.reset()
        setIsSubmitting(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-6 pb-20">
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-2xl mx-auto">
        <div className="mb-8 rounded-lg bg-stone-50 border border-stone-200 px-4 py-3">
          <p className="text-sm text-slate-600">You&apos;re claiming</p>
          <p className="text-lg font-semibold text-gray-900">{shopName}</p>
          {neighborhood && <p className="text-sm text-slate-600">{neighborhood}</p>}
        </div>

        {companyName && (
          <div className="mb-8 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
            <p className="text-sm text-amber-900">
              Part of {companyName}. You&apos;re claiming just{' '}
              {neighborhood ? (
                <>
                  the <span className="font-semibold">{neighborhood}</span> location
                </>
              ) : (
                'this location'
              )}
              {' '}— each location is claimed separately.
            </p>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">How claiming works</h2>
          <ol className="space-y-4">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-yellow-300 text-xs font-semibold text-black">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{step.title}</p>
                  <p className="text-sm text-slate-600">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <form onSubmit={handleForm} ref={claimForm} className="space-y-8 border-t border-stone-200 pt-8">
          <fieldset className="space-y-6">
            <legend className="text-sm font-semibold text-gray-900 mb-4">About you</legend>

            <div>
              <label htmlFor="contact_name" className="block text-sm font-medium text-gray-900 mb-2">
                Your name <span className="text-red-500">*</span>
              </label>
              <input id="contact_name" name="contact_name" required type="text" className={inputClasses} />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-900 mb-2">
                Your role at the shop
              </label>
              <input id="role" name="role" type="text" placeholder="Owner, manager, …" className={inputClasses} />
            </div>
          </fieldset>

          <fieldset className="space-y-6">
            <legend className="text-sm font-semibold text-gray-900 mb-4">How I&apos;ll reach you</legend>

            <div>
              <label htmlFor="business_email" className="block text-sm font-medium text-gray-900 mb-2">
                Business email <span className="text-red-500">*</span>
              </label>
              <input id="business_email" name="business_email" required type="email" className={inputClasses} />
              <p className="mt-2 text-xs text-slate-500">
                An email on the shop&apos;s domain speeds up verification.
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="w-full">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                  Phone
                </label>
                <input id="phone" name="phone" type="tel" className={inputClasses} />
              </div>

              <div className="w-full">
                <label htmlFor="social_media" className="block text-sm font-medium text-gray-900 mb-2">
                  Social media
                </label>
                <input
                  id="social_media"
                  name="social_media"
                  type="text"
                  placeholder="@yourshop on Instagram, etc."
                  className={inputClasses}
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-gray-900 mb-4">Anything that proves it&apos;s your shop</legend>
            <label htmlFor="message" className="sr-only">
              Anything that helps confirm ownership
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="A link to your site that lists this email, social handles you manage, etc."
              className={inputClasses}
            />
          </fieldset>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-lg py-3 px-4 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 ${
              isSubmitting ? 'bg-yellow-100 cursor-not-allowed' : 'bg-yellow-300 hover:bg-yellow-400'
            }`}
          >
            {isSubmitting ? 'Submitting…' : 'Submit claim'}
          </button>
        </form>
      </div>

      <ClaimSuccessDialog isOpen={successDialogIsOpen} handleClose={() => setSuccessDialogIsOpen(false)} />
    </section>
  )
}
