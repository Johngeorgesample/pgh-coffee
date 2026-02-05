'use client'

import { useState, useCallback } from 'react'

export function useCopyToClipboard() {
  const [showToast, setShowToast] = useState(false)

  const copyCurrentUrl = useCallback(async () => {
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
