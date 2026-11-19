'use client'

import { useEffect } from 'react'

const VISITED_KEY = 'advent:visited'

export const readVisited = (): number[] => JSON.parse(localStorage.getItem(VISITED_KEY) ?? '[]')

export default function MarkVisited({ jar }: { jar: number }) {
  useEffect(() => {
    const visited = readVisited()
    if (!visited.includes(jar)) localStorage.setItem(VISITED_KEY, JSON.stringify([...visited, jar]))
  }, [jar])
  return null
}
