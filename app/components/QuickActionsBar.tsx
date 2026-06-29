'use client'
import { useEffect, useRef, useState } from 'react'
import { TShop } from '@/types/shop-types'
import DirectionsButton from './DirectionsButton'
import WebsiteButton from './WebsiteButton'
import ShareButton from './ShareButton'
import FavoriteButton from './FavoriteButton'
import VisitedButton from './VisitedButton'
import ReportIssueButton from './ReportIssueButton'
import ClaimShopButton from './ClaimShopButton'
import IssueModal from './IssueModal'
import IssueSuccessDialog from './IssueSuccessDialog'

interface QuickActionsBarProps {
  shop: TShop
}

export default function QuickActionsBar({ shop }: QuickActionsBarProps) {
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { website, uuid, name } = shop.properties
  const coordinates = shop.geometry?.coordinates

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 0
  }, [uuid])

  function handleIssueSuccess() {
    setShowIssueModal(false)
    setShowSuccessDialog(true)
  }

  return (
    <>
      <div ref={scrollRef} className="flex items-center gap-2 px-4 sm:px-6 py-4 bg-white border-b border-stone-200">
        <DirectionsButton coordinates={coordinates} />
        <FavoriteButton shopUUID={uuid} shopName={name} />
        <VisitedButton shopUUID={uuid} shopName={name} />
        <ShareButton />
        {website && <WebsiteButton website={website} />}
        <ReportIssueButton onClick={() => setShowIssueModal(true)} />
        <ClaimShopButton shopUUID={uuid} shopName={name} />
      </div>

      <IssueModal shop={shop} isOpen={showIssueModal} onClose={() => setShowIssueModal(false)} onSuccess={handleIssueSuccess} />
      <IssueSuccessDialog isOpen={showSuccessDialog} handleClose={() => setShowSuccessDialog(false)} />
    </>
  )
}
