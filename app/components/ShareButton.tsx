'use client'

import { useState } from 'react'
import { Share2 } from 'lucide-react'
import CopyLinkToast from './CopyLinkToast'

export default function ShareButton() {
  const [showToast, setShowToast] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShowToast(true)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <>
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-800 px-4 py-2.5 rounded-3xl text-sm font-medium border border-stone-200 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>
      <CopyLinkToast isOpen={showToast} onClose={() => setShowToast(false)} />
    </>
  )
}
