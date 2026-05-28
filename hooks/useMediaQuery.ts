'use client'

import { useSyncExternalStore } from 'react'

const getServerSnapshot = () => false

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(query)
      const listener = () => callback()
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    },
    () => window.matchMedia(query).matches,
    getServerSnapshot,
  )
}
