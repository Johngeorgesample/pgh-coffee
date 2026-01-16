'use client'

import { useState, useEffect } from 'react'
import { Calendar, SquareArrowOutUpRight, MapPin } from 'lucide-react'
import { usePlausible } from 'next-plausible'
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

const TagBadge = ({ label }: { label: string }) => {
  const cls = TAG_STYLES[label as TagKey] ?? 'bg-gray-100 text-gray-800'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${cls}`}>
      {label}
    </span>
  )
}

const formatNewsDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
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

  const handleExternalLink = () => {
    if (!news?.url) return
    plausible('NewsExternalLinkClick', {
      props: { newsId: news.id, newsTitle: news.title, url: news.url },
    })
  }

  if (loading) {
    return (
      <div className="flex mt-24 lg:mt-16 h-full flex-col">
        <div className="flex-grow overflow-y-auto pb-56">
          <div className="p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="flex items-start gap-3 mb-6">
              <div className="bg-gray-200 p-2.5 rounded-lg w-9 h-9"></div>
              <div>
                <div className="h-3 bg-gray-200 rounded w-12 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <div className="h-3 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!news) {
    return (
      <div className="flex mt-24 lg:mt-16 h-full flex-col">
        <div className="p-6">
          <p className="text-gray-600">News not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex mt-24 lg:mt-16 h-full flex-col">
      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto pb-56">
        {/* Title Section */}
        <div className="flex">
          <div className="p-6 flex-1">
            <h1 className="font-display text-[28px] font-bold tracking-tight text-slate-900 mb-3 leading-tight">
              {news.title}
            </h1>
          </div>
        </div>

        {/* Details Section */}
        <div className="px-6 space-y-6">
          {/* Date */}
          {news.post_date && (
            <div className="flex items-start gap-3">
              <div className="bg-yellow-100 p-2.5 rounded-lg">
                <Calendar className="w-4 h-4 text-yellow-500" />
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-yellow-500 uppercase tracking-wider mb-1">
                  Posted
                </span>
                <span className="text-slate-900 font-medium text-[15px]">
                  {formatNewsDate(news.post_date)}
                </span>
              </div>
            </div>
          )}

          {/* Location */}
          {news.shop && (
            <div className="flex items-start gap-3">
              <div className="bg-yellow-100 p-2.5 rounded-lg">
                <MapPin className="w-4 h-4 text-yellow-500" />
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-yellow-500 uppercase tracking-wider mb-1">
                  Location
                </span>
                <button
                  onClick={handleShopClick}
                  className="text-left hover:opacity-80 transition-opacity"
                >
                  <div className="text-slate-900 font-bold text-[15px]">
                    {news.shop.name}
                  </div>
                  {news.shop.neighborhood && (
                    <div className="text-sm text-gray-500 mt-0.5">
                      {news.shop.neighborhood}
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Divider and Description */}
          <div className="border-t border-gray-200 pt-6">
            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
              About
            </span>
            {news.description && (
              <p className="text-gray-600 leading-relaxed">
                {news.description}
              </p>
            )}
          </div>

          {/* Tags */}
          {news.tags && news.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {news.tags.map(t => (
                <TagBadge key={t} label={t} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-neutral-50 border-t border-gray-100">
        <div className="flex flex-col gap-4">
          {news.url && (
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleExternalLink}
              className="w-full bg-yellow-400 text-slate-900 font-bold py-4 rounded-full shadow-sm hover:shadow-md hover:bg-yellow-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 no-underline"
            >
              View Source
              <SquareArrowOutUpRight className="w-5 h-5" />
            </a>
          )}

          <p className="text-[11px] text-center text-gray-400 italic">
            Information may have changed since this was posted.
          </p>
        </div>
      </div>
    </div>
  )
}
