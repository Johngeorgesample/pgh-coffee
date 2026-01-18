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
  const [ updates, setUpdates ] = useState([])

  useEffect(() => {
    fetchUpdates().then(setUpdates)
  }, [])

  // ensure newest first
  const items = [...updates].sort((a: any, b: any) => parseYMDLocal(b.post_date).getTime() - parseYMDLocal(a.post_date).getTime())

  // group by day
  const groups = items.reduce<Record<string, typeof items>>((acc: any, it: any) => {
    ;(acc[it.post_date] ||= []).push(it)
    return acc
  }, {})

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="mt-20 px-4 py-3 leading-relaxed">
        {Object.entries(groups).map(([day, entries]) => (
          <section key={day} className="mb-4">
            <DayHeader date={day} />
            <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white">
              {entries.map((entry: NewsItem, i: number) => (
                <NewsCard key={i} asLink={true} item={entry} variant="pill" />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
