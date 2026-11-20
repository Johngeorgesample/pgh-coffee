'use client'

import { useEffect } from 'react'
import { currentDate, daysOpen, openTiming } from '@/app/utils/advent'
import { storageJSON, storageSet } from '@/app/utils/storage'
import { useAnalytics } from '@/hooks'

const VISITED_KEY = 'advent:visited'

export const readVisited = () => {
  const visited = storageJSON<unknown>(VISITED_KEY, [])
  return Array.isArray(visited) ? (visited as number[]) : []
}

export default function MarkVisited({ jar, order, step }: { jar: number; order: string; step: number }) {
  const track = useAnalytics()
  useEffect(() => {
    const visited = readVisited()
    if (visited.includes(jar)) return
    storageSet(VISITED_KEY, JSON.stringify([...visited, jar]))
    track('AdventJarOpened', { props: { order, step, jar, timing: openTiming(step, daysOpen(currentDate())) } })
  }, [jar, order, step, track])
  return null
}
