'use client'

import { useState } from 'react'
import { usePlausible } from 'next-plausible'

import AmenityChip from './AmenityChip'
import AmenityReportModal from './AmenityReportModal'
import IssueSuccessDialog from './IssueSuccessDialog'

interface IProps {
  amenities: string[]
  shopId: string
}

export default function ShopAmenities({ amenities, shopId }: IProps) {
  const plausible = usePlausible()
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
      <div className="flex flex-wrap gap-2 my-3">
        {amenities.map(amenity => (
          <AmenityChip key={amenity} amenity={amenity} />
        ))}
      </div>

      <p className="text-xs text-gray-700">
        Missing something?{' '}
        <button aria-label="Report amenity" className="text-amber-700" onClick={handleOnClick}>
          Let me know
        </button>
      </p>

      <AmenityReportModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => setShowSuccess(true)}
        amenities={amenities}
        shopId={shopId}
      />

      <IssueSuccessDialog isOpen={showSuccess} handleClose={() => setShowSuccess(false)} />
    </>
  )
}
