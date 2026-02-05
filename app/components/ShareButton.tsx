'use client'

import { Share2 } from 'lucide-react'
import { useCopyToClipboard } from '@/hooks'
import CopyLinkToast from './CopyLinkToast'

export default function ShareButton() {
  const { showToast, copyCurrentUrl, closeToast } = useCopyToClipboard()

  return (
    <>
      <button
        onClick={copyCurrentUrl}
        className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-800 px-4 py-2.5 rounded-3xl text-sm font-medium border border-stone-200 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>
      <CopyLinkToast isOpen={showToast} onClose={closeToast} />
    </>
  )
}
