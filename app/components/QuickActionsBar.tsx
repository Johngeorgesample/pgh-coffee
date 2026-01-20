'use client'
import { useState } from 'react'
import DirectionsButton from './DirectionsButton'
import WebsiteButton from './WebsiteButton'
import ShareButton from './ShareButton'
import FavoriteButton from './FavoriteButton'
import ShareModal from './ShareModal'

interface QuickActionsBarProps {
  coordinates: [number, number]
  website?: string
  shopUUID: string
  shopName: string
}

export default function QuickActionsBar({ coordinates, website, shopUUID, shopName }: QuickActionsBarProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  return (
    <>
      <div className="flex gap-2 px-4 sm:px-6 py-4 bg-white border-b border-stone-200">
        <DirectionsButton coordinates={coordinates} />
        {website && <WebsiteButton website={website} />}
        <ShareButton onClick={() => setIsShareModalOpen(true)} />
        <FavoriteButton shopUUID={shopUUID} shopName={shopName} />
      </div>

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </>
  )
}
