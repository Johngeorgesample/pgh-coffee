'use client'

import { useEffect, useState } from 'react'
import { usePlausible } from 'next-plausible'
import usePanelStore from '@/stores/panelStore'
import { News } from '@/app/components/News'
import { NewsCard, type NewsCardItem } from '@/app/components/NewsCard'

export const NewsCTA = () => {
  const plausible = usePlausible()
  const { setPanelContent } = usePanelStore()

  const [updates, setUpdates] = useState<NewsCardItem[]>([])

  useEffect(() => {
    fetch('/api/updates')
      .then(res => res.json())
      .then(data => setUpdates(data ?? []))
  }, [])

  const lastTwo = updates.slice(0, 2)

  const openNews = () => {
    plausible('ViewAllClick', { props: { section: 'news' } })
    setPanelContent(<News />, 'news')
  }

  if (lastTwo.length === 0) return null

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="flex-1 text-xs font-semibold uppercase tracking-wider text-stone-500">
          Latest news
        </h3>
        <button
          className="text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: 'lab(45 10 50)' }}
          onClick={openNews}
        >
          View all
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {lastTwo.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </>
  )
}
