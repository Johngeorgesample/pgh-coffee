'use client'

import { useState, useCallback } from 'react'

export function useCopyToClipboard() {
  const [showToast, setShowToast] = useState(false)

  const share = useCallback(async (url: string) => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches
    if (isMobile && navigator.share) {
      try {
        await navigator.share({ url })
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Failed to share:', err)
        }
      }
      return
    }

    try {
      await navigator.clipboard.writeText(url)
      setShowToast(true)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [])

  // Ignores any argument (safe to pass directly as an onClick handler) and
  // shares the current page URL.
  const copyCurrentUrl = useCallback(() => share(window.location.href), [share])

  const closeToast = useCallback(() => {
    setShowToast(false)
  }, [])

  return { showToast, share, copyCurrentUrl, closeToast }
}
