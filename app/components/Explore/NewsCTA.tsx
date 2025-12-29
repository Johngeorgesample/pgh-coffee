'use client'

import { useEffect, useState } from 'react'
import usePanelStore from '@/stores/panelStore'
import { News } from '@/app/components/News'
import { NewsCard, NewsCardData } from '@/app/components/NewsCard'
import { parseYMDLocal } from '@/app/utils/utils'

export const NewsCTA = () => {
  const { setPanelContent } = usePanelStore()

  const fetchNews = async () => {
    const response = await fetch('/api/updates')
    return await response.json()
  }

  const [updates, setUpdates] = useState<NewsCardData[]>([])

  useEffect(() => {
    fetchNews().then(setUpdates)
  }, [])

  // Sort by post_date newest first, then take first 3
  const latestThree = [...updates]
    .sort((a, b) => parseYMDLocal(b.post_date).getTime() - parseYMDLocal(a.post_date).getTime())
    .slice(0, 3)

  const openNews = () => setPanelContent(<News />, 'news')

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="flex-1 text-xs font-semibold uppercase tracking-wider text-stone-500">
          Latest News
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
        {latestThree.map((newsItem, index) => (
          <NewsCard
            key={index}
            entry={newsItem}
            asLink={!!newsItem.url}
          />
        ))}
      </div>
    </>
  )
}
