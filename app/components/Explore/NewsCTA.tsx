'use client'

import { useEffect, useState } from 'react'
import { usePlausible } from 'next-plausible'
import { ChevronRight } from 'lucide-react';
import usePanelStore from '@/stores/panelStore'
import { News } from '@/app/components/News'
import { NewsCard } from '@/app/components/NewsCard'
import { NewsItem } from '@/types/news-types'

const NewsCardSkeleton = () => (
  <div className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden animate-pulse">
    <div className="p-5 border-l-[2px] border-stone-200">
      <div className="mb-2">
        <div className="h-4 w-16 bg-stone-200 rounded" />
      </div>
      <div className="h-6 w-3/4 bg-stone-200 rounded mb-2" />
      <div className="h-4 w-full bg-stone-100 rounded mb-1" />
      <div className="h-4 w-2/3 bg-stone-100 rounded mb-4" />
      <div className="h-3 w-20 bg-stone-200 rounded" />
    </div>
  </div>
)

export const NewsCTA = () => {
  const plausible = usePlausible()
  const { setPanelContent } = usePanelStore()

  const [updates, setUpdates] = useState<NewsItem[] | null>(null)

  useEffect(() => {
    fetch('/api/updates')
      .then(res => res.json())
      .then(data => setUpdates(data ?? []))
  }, [])

  const openNews = () => {
    plausible('ViewAllClick', { props: { section: 'news' } })
    setPanelContent(<News />, 'news')

    const url = new URL(window.location.href)
    url.searchParams.delete('shop')
    url.searchParams.delete('company')
    url.searchParams.delete('roaster')
    url.searchParams.delete('event')
    url.searchParams.delete('events')
    const baseUrl = url.origin + url.pathname
    window.history.replaceState({}, '', baseUrl + '?news')
  }

  const isLoading = updates === null
  const lastTwo = updates?.slice(0, 2) ?? []

  if (!isLoading && lastTwo.length === 0) return null

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="flex-1 text-xs font-semibold uppercase tracking-wider text-stone-500">
          Latest news
        </h3>
        <button
          className="flex gap-0.5 items-center text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: 'lab(45 10 50)' }}
          onClick={openNews}
        >
          View all
          <ChevronRight className="h-5 w-5"/>
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {isLoading ? (
          <>
            <NewsCardSkeleton />
            <NewsCardSkeleton />
          </>
        ) : (
          lastTwo.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))
        )}
      </div>
    </>
  )
}
