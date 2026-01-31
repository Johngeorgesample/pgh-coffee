'use client'

import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { usePlausible } from 'next-plausible'
import LoginPromptModal from './LoginPromptModal'
import SaveModal from './SaveModal'
import { useAuth } from './AuthProvider'

interface SaveButtonProps {
  shopUUID: string
  shopName: string
}

export default function SaveButton({ shopUUID, shopName }: SaveButtonProps) {
  const { user } = useAuth()
  const plausible = usePlausible()
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleToggle = async () => {
    console.log('handleToggle')
    if (!user) {
      setShowLoginModal(true)
      return
    }
    setIsSaveModalOpen(true)
  }

  return (
    <>
      <button
        onClick={handleToggle}
        className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-800 px-4 py-2.5 rounded-3xl text-sm font-medium border border-stone-200 transition-colors disabled:opacity-50"
      >
        <Bookmark className="w-4 h-4 transition-colors" />
        Save
      </button>
      <SaveModal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} shopName={shopName} />
      <LoginPromptModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}
