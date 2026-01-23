'use client'
import { useState } from 'react'
import { TShop } from '@/types/shop-types'
import DirectionsButton from './DirectionsButton'
import WebsiteButton from './WebsiteButton'
import ShareButton from './ShareButton'
import FavoriteButton from './FavoriteButton'
import ReportIssueButton from './ReportIssueButton'
import ShareModal from './ShareModal'
import IssueModal from './IssueModal'
import IssueSuccessDialog from './IssueSuccessDialog'

interface QuickActionsBarProps {
  shop: TShop
}

export default function QuickActionsBar({ shop }: QuickActionsBarProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const { website, uuid, name } = shop.properties
  const coordinates = shop.geometry?.coordinates

  function handleIssueSuccess() {
    setShowIssueModal(false)
    setShowSuccessDialog(true)
  }

  return (
    <>
      <div className="flex gap-2 px-4 sm:px-6 py-4 bg-white border-b border-stone-200 overflow-x-auto [&>button]:shrink-0">
        <FavoriteButton shopUUID={uuid} shopName={name} />
        <ShareButton onClick={() => setIsShareModalOpen(true)} />
        <DirectionsButton coordinates={coordinates} />
        {website && <WebsiteButton website={website} />}
        <ReportIssueButton onClick={() => setShowIssueModal(true)} />
      </div>

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
      <IssueModal shop={shop} isOpen={showIssueModal} onClose={() => setShowIssueModal(false)} onSuccess={handleIssueSuccess} />
      <IssueSuccessDialog isOpen={showSuccessDialog} handleClose={() => setShowSuccessDialog(false)} />
    </>
  )
}
