'use client'

import { useEffect } from 'react'
import { storageJSON, storageSet } from '@/app/utils/storage'

const VISITED_KEY = 'advent:visited'

export const readVisited = () => {
  const visited = storageJSON<unknown>(VISITED_KEY, [])
  return Array.isArray(visited) ? (visited as number[]) : []
}

export default function MarkVisited({ jar }: { jar: number }) {
  useEffect(() => {
    const visited = readVisited()
    if (!visited.includes(jar)) storageSet(VISITED_KEY, JSON.stringify([...visited, jar]))
  }, [jar])
  return null
}
