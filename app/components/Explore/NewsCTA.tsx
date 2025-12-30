'use client'

import { useEffect, useState } from 'react'
import { usePlausible } from 'next-plausible'
import usePanelStore from '@/stores/panelStore'
import { News } from '@/app/components/News'
import { parseYMDLocal, fmtYMD } from '@/app/utils/utils'
import { ArrowTopRightOnSquareIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline'

type NewsCardData = {
  title: string
  description?: string
  url?: string
  tags?: string[]
  post_date: string
  event_date?: string
}

type TagKey = 'opening' | 'closure' | 'coming soon' | 'throwdown' | 'event' | 'seasonal' | 'menu'

const TAG_STYLES: Record<TagKey, string> = {
  opening: 'bg-green-100 text-green-800',
  closure: 'bg-red-100 text-red-800',
  'coming soon': 'bg-amber-100 text-amber-800',
  throwdown: 'bg-purple-100 text-purple-800',
  event: 'bg-blue-100 text-blue-800',
  seasonal: 'bg-pink-100 text-pink-800',
  menu: 'bg-slate-100 text-slate-800',
}

const TagBadge = ({ label }: { label: string }) => {
  const cls = TAG_STYLES[label as TagKey] ?? 'bg-gray-100 text-gray-800'
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${cls}`}>
      <TagIcon className="h-3 w-3" />
      {label}
    </span>
  )
}

const EventDatePill = ({ date }: { date: string }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-800 px-2 py-0.5 text-[11px]">
    <CalendarIcon className="h-3 w-3" />
    {fmtYMD(date)}
  </span>
)

export const NewsCTA = () => {
  const plausible = usePlausible()
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

  const openNews = () => {
    plausible('ViewAllClick', { props: { section: 'news' } })
    setPanelContent(<News />, 'news')
  }

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

      <ul className="mt-3 divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white">
        {latestThree.map((newsItem, index) => (
          <li key={index} className="p-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-gray-900">{newsItem.title}</h3>
              {newsItem.url && (
                <a
                  href={newsItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-gray-500 hover:text-gray-700"
                  aria-label="Source"
                  title="Source"
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </a>
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              {newsItem.event_date && <EventDatePill date={newsItem.event_date} />}
              {newsItem.tags?.map((t) => <TagBadge key={t} label={t} />)}
            </div>

            {newsItem.description && (
              <p className="mt-2 text-sm text-gray-700 line-clamp-2">{newsItem.description}</p>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
