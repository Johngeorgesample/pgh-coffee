'use client'

import { useLayoutEffect } from 'react'
import { seedPanel } from '@/hooks/useSeededFetch'

export default function PanelSeed({ seedKey, data }: { seedKey: string; data: unknown }) {
  useLayoutEffect(() => seedPanel(seedKey, data), [seedKey, data])
  return null
}
