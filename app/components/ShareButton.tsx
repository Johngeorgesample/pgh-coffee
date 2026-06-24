'use client'

import { Share2 } from 'lucide-react'
import { useCopyToClipboard } from '@/hooks'
import CopyLinkToast from './CopyLinkToast'

export default function ShareButton() {
  const { showToast, copyCurrentUrl, closeToast } = useCopyToClipboard()

  return (
    <>
      <button
        type="button"
        onClick={copyCurrentUrl}
        aria-label="Share"
        title="Share"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 transition-colors"
      >
        <Share2 className="size-[18px]" />
      </button>
      <CopyLinkToast isOpen={showToast} onClose={closeToast} />
    </>
  )
}
