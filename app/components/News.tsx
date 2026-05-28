'use client'

import { useEffect, useState } from 'react'
import { fmtYMD, parseYMDLocal } from '@/app/utils/utils'
import { NewsCard } from '@/app/components/NewsCard'
import { NewsItem } from '@/types/news-types'

const DayHeader = ({ date }: { date: string }) => (
  <div className="sticky top-0 isolate -mx-4 px-4 py-2 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60">
    <p className="text-xs font-semibold tracking-wide text-gray-500">Posted {fmtYMD(date)}</p>
  </div>
)


const fetchUpdates = async () => {
  const response = await fetch('/api/updates')
  return await response.json()
}

export const News = () => {
  const [ updates, setUpdates ] = useState<NewsItem[]>([])

  useEffect(() => {
    fetchUpdates().then(setUpdates)
  }, [])

  // ensure newest first
  const items = updates.toSorted((a: NewsItem, b: NewsItem) => {
    const aTime = a.post_date ? parseYMDLocal(a.post_date).getTime() : 0
    const bTime = b.post_date ? parseYMDLocal(b.post_date).getTime() : 0
    return bTime - aTime
  })

  // group by day
  const groups = items.reduce<Record<string, NewsItem[]>>((acc, it) => {
    const key = it.post_date ?? 'unknown'
    ;(acc[key] ||= []).push(it)
    return acc
  }, {})

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="mt-20 px-4 py-3 leading-relaxed">
        {Object.entries(groups).map(([day, entries]) => (
          <section key={day} className="mb-4">
            <DayHeader date={day} />
            <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white">
              {entries.map((entry: NewsItem) => (
                <NewsCard key={entry.id} asLink={true} item={entry} variant="pill" />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
