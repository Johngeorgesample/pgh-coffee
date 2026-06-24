'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useAnalytics } from '@/hooks'

import { getAmenity } from '@/lib/amenities'
import IssueSuccessDialog from './IssueSuccessDialog'

const AmenityReportModal = dynamic(() => import('./AmenityReportModal'), { ssr: false })

interface IProps {
  amenities: string[]
  shopId: string
}

export default function ShopAmenities({ amenities, shopId }: IProps) {
  const plausible = useAnalytics()
  const [showModal, setShowModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleOnClick = () => {
    setShowModal(true)
    plausible('reportAmenityIssue', {
      props: {
        shopId,
      },
    })
  }

  if (!amenities.length) return null

  return (
    <>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Amenities</p>

      <div className="grid grid-cols-2 gap-2">
        {amenities.map(amenity => {
          const entry = getAmenity(amenity)
          if (!entry) return null
          const Icon = entry.icon
          return (
            <div
              key={amenity}
              className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700"
            >
              <Icon className="h-4 w-4 shrink-0 text-stone-500" />
              {entry.label}
            </div>
          )
        })}
      </div>

      <p className="mt-3 text-xs text-gray-700">
        Missing something?{' '}
        <button type="button" aria-label="Report amenity" className="text-amber-700" onClick={handleOnClick}>
          Let me know
        </button>
      </p>

      {showModal && (
        <AmenityReportModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => setShowSuccess(true)}
          amenities={amenities}
          shopId={shopId}
        />
      )}

      <IssueSuccessDialog isOpen={showSuccess} handleClose={() => setShowSuccess(false)} />
    </>
  )
}
