'use client'
import { useEffect, useState } from 'react'
import { NewsCard } from '@/app/components/NewsCard'

export const NewsCTA = () => {
  const [item, setItem] = useState(null)

  useEffect(() => {
    fetch('/api/updates')
      .then(res => res.json())
      .then(data => setItem(data[0] ?? null))
  }, [])

  if (!item) return null

  return <NewsCard item={item} />
}
