'use client'
import { formatDBShopAsFeature } from '../utils/utils'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useShopSelection } from '@/hooks'
import { DbShop } from '@/types/shop-types'
import usePanelStore from '@/stores/panelStore'
import { NewsDetails } from './NewsDetails'
import { usePlausible } from 'next-plausible'

export type NewsCardData = {
  id?: string
  title: string
  description?: string | null
  url?: string | null
  tags?: string[] | null
  post_date?: string | null
  event_date?: string | null
  eventDate?: string | null
}

export type NewsCardItem = NewsCardData & {
  shop_id?: string
  shop?: DbShop
}

type TagKey = 'opening' | 'closure' | 'coming soon' | 'throwdown' | 'event' | 'seasonal' | 'menu'

const TAG_LABELS: Record<TagKey, string> = {
  opening: 'New Shop',
  closure: 'Closing',
  'coming soon': 'Coming Soon',
  throwdown: 'Throwdown',
  event: 'Event',
  seasonal: 'Seasonal',
  menu: 'Menu Update',
}

const TAG_STYLES: Record<TagKey, { badge: string; border: string }> = {
  opening: {
    badge: 'bg-green-50 text-green-600 border-green-100',
    border: 'border-green-500',
  },
  closure: {
    badge: 'bg-red-50 text-red-600 border-red-100',
    border: 'border-red-500',
  },
  'coming soon': {
    badge: 'bg-blue-50 text-blue-600 border-blue-100',
    border: 'border-blue-500',
  },
  throwdown: {
    badge: 'bg-purple-50 text-purple-600 border-purple-100',
    border: 'border-purple-500',
  },
  event: {
    badge: 'bg-amber-50 text-amber-600 border-amber-100',
    border: 'border-amber-500',
  },
  seasonal: {
    badge: 'bg-orange-50 text-orange-600 border-orange-100',
    border: 'border-orange-500',
  },
  menu: {
    badge: 'bg-teal-50 text-teal-600 border-teal-100',
    border: 'border-teal-500',
  },
}

const DEFAULT_STYLE = {
  badge: 'bg-stone-50 text-stone-600 border-stone-100',
  border: 'border-primary',
}

type NewsCardProps = {
  item: NewsCardItem
  asLink?: boolean
  variant?: string
  showPastOpacity?: boolean
}

export const NewsCard = ({ item }: NewsCardProps) => {
  const { handleShopSelect } = useShopSelection()
  const { setPanelContent } = usePanelStore()
  const plausible = usePlausible()
  const primaryTag = item.tags?.[0] as TagKey | undefined
  const label = primaryTag ? (TAG_LABELS[primaryTag] ?? primaryTag.toUpperCase()) : 'News'
  const styles = primaryTag ? (TAG_STYLES[primaryTag] ?? DEFAULT_STYLE) : DEFAULT_STYLE

  const handleCardClick = () => {
    if (item.id) {
      plausible('NewsCardClick', {
        props: { newsId: item.id, newsTitle: item.title },
      })
      setPanelContent(<NewsDetails id={item.id} />, 'news')
    }
  }

  const handleShopClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (item.shop_id && item.shop) {
      handleShopSelect(formatDBShopAsFeature(item.shop))
    }
  }

  return (
    <article
      onClick={handleCardClick}
      className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden flex flex-col transition-all hover:shadow-md cursor-pointer"
    >
      <div className={`p-5 border-l-[3px] ${styles.border}`}>
        <div className="mb-2">
          <span
            className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${styles.badge}`}
          >
            {label}
          </span>
        </div>

        <h3 className="text-xl font-bold mb-2 leading-tight text-gray-900">
          {item.title}
        </h3>

        {item.description && (
          <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.description}</p>
        )}

        <span className="inline-flex items-center text-xs font-bold text-gray-900 hover:opacity-70 transition-opacity">
          {item.shop_id && item.shop ? (
            <span onClick={handleShopClick} className="inline-flex items-center">
              View {item.shop.name}
              <ArrowRightIcon className="ml-1 h-3 w-3" />
            </span>
          ) : (
            <>
              Read more
              <ArrowRightIcon className="ml-1 h-3 w-3" />
            </>
          )}
        </span>
      </div>
    </article>
  )
}
