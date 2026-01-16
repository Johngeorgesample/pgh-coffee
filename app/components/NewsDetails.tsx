'use client'

import { useState, useEffect } from 'react'
import { ArrowTopRightOnSquareIcon, CalendarIcon, MapPinIcon, TagIcon } from '@heroicons/react/24/outline'
import { usePlausible } from 'next-plausible'
import { fmtYMD } from '@/app/utils/utils'
import { useShopSelection } from '@/hooks'
import { formatDBShopAsFeature } from '@/app/utils/utils'
import { DbShop } from '@/types/shop-types'

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

const TAG_LABELS: Record<TagKey, string> = {
  opening: 'New Shop',
  closure: 'Closing',
  'coming soon': 'Coming Soon',
  throwdown: 'Throwdown',
  event: 'Event',
  seasonal: 'Seasonal',
  menu: 'Menu Update',
}

interface NewsItem {
  id: string
  title: string
  description?: string | null
  url?: string | null
  tags?: string[] | null
  post_date?: string | null
  event_date?: string | null
  shop_id?: string
  shop?: DbShop
}

export const NewsDetails = ({ id }: { id: string }) => {
  const [news, setNews] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)
  const plausible = usePlausible()
  const { handleShopSelect } = useShopSelection()

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/updates/${id}`)
        if (!response.ok) throw new Error('News not found')
        const data = await response.json()
        setNews(data)
        plausible('NewsView', {
          props: { newsId: id, newsTitle: data.title },
        })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [id, plausible])

  useEffect(() => {
    if (news?.id) {
      const url = new URL(window.location.href)
      const params = new URLSearchParams(url.search)
      params.delete('shop')
      params.delete('company')
      params.delete('roaster')
      params.set('news', news.id)
      url.search = params.toString()
      window.history.pushState(null, '', url.toString())
    }
  }, [news])

  const handleShopClick = () => {
    if (news?.shop_id && news?.shop) {
      handleShopSelect(formatDBShopAsFeature(news.shop))
    }
  }

  if (loading) {
    return (
      <div className="px-6 lg:px-4 mt-24 lg:mt-16 flex flex-col animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (!news) {
    return <p className="px-6 lg:px-4 mt-24 lg:mt-16">News not found</p>
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="px-6 lg:px-4 mt-20 lg:mt-16 flex flex-col">
        {/* Header with title and external link */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 className="font-medium text-2xl">{news.title}</h2>
          {news.url && (
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                plausible('NewsExternalLinkClick', {
                  props: { newsId: news.id, newsTitle: news.title, url: news.url },
                })
              }
              className="shrink-0 text-stone-400 transition-colors hover:text-stone-600"
              aria-label="Source"
              title="Source"
            >
              <ArrowTopRightOnSquareIcon className="h-5 w-5" />
            </a>
          )}
        </div>

        {/* Post date */}
        {news.post_date && (
          <div className="flex items-center gap-2 text-sm text-stone-600 mb-4">
            <CalendarIcon className="h-4 w-4" />
            <span>Posted {fmtYMD(news.post_date)}</span>
          </div>
        )}

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            {news.tags.map(t => {
              const cls = TAG_STYLES[t as TagKey] ?? 'bg-gray-100 text-gray-800'
              return (
                <span key={t} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${cls}`}>
                  <TagIcon className="h-3 w-3" />
                  {TAG_LABELS[t as TagKey] ?? t}
                </span>
              )
            })}
          </div>
        )}

        {/* Description */}
        {news.description && (
          <p className="text-sm leading-relaxed text-stone-600 mb-4">{news.description}</p>
        )}

        {/* Shop info */}
        {news.shop && (
          <button
            onClick={handleShopClick}
            className="flex items-center gap-2 text-sm text-stone-600 mb-4 hover:text-stone-900 transition-colors text-left"
          >
            <MapPinIcon className="h-4 w-4" />
            <span className="font-semibold" style={{ color: 'lab(45 10 50)' }}>
              {news.shop.name}
            </span>
            {news.shop.neighborhood && (
              <>
                <span>•</span>
                <span>{news.shop.neighborhood}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
