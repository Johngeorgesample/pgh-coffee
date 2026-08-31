'use client'
import { useEffect, useRef, useState } from 'react'
import { TShop } from '@/types/shop-types'
import DirectionsButton from './DirectionsButton'
import WebsiteButton from './WebsiteButton'
import ShareButton from './ShareButton'
import ToggleButton from './ToggleButton'
import { FAVORITE_TOGGLE_CONFIG, VISITED_TOGGLE_CONFIG } from './toggleConfigs'
import ReportIssueButton from './ReportIssueButton'
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
        <ToggleButton shopUUID={uuid} shopName={name} config={FAVORITE_TOGGLE_CONFIG} />
        <ToggleButton shopUUID={uuid} shopName={name} config={VISITED_TOGGLE_CONFIG} />
        <ShareButton />
        {website && <WebsiteButton website={website} />}
        <ReportIssueButton onClick={() => setShowIssueModal(true)} />
      </div>

      <IssueModal shop={shop} isOpen={showIssueModal} onClose={() => setShowIssueModal(false)} onSuccess={handleIssueSuccess} />
      <IssueSuccessDialog isOpen={showSuccessDialog} handleClose={() => setShowSuccessDialog(false)} />
    </>
  )
}
