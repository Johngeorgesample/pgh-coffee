'use client'

import { useState, useCallback } from 'react'

export function useCopyToClipboard() {
  const [showToast, setShowToast] = useState(false)

  const copyCurrentUrl = useCallback(async () => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches
    if (isMobile && navigator.share) {
      try {
        await navigator.share({ url: window.location.href })
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Failed to share:', err)
        }
      }
      return
    }

    try {
      await navigator.clipboard.writeText(window.location.href)
      setShowToast(true)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [])

  const closeToast = useCallback(() => {
    setShowToast(false)
  }, [])

  return { showToast, copyCurrentUrl, closeToast }
}
