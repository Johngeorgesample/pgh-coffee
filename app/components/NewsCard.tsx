'use client'
import { formatDBShopAsFeature } from '../utils/utils'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useShopSelection } from '@/hooks'
import { DbShop } from '@/types/shop-types'

export type NewsCardData = {
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

type NewsCardProps = {
  item: NewsCardItem
  asLink?: boolean
  variant?: string
  showPastOpacity?: boolean
}

export const NewsCard = ({ item }: NewsCardProps) => {
  const { handleShopSelect } = useShopSelection()
  const primaryTag = item.tags?.[0] as TagKey | undefined
  const label = primaryTag ? (TAG_LABELS[primaryTag] ?? primaryTag.toUpperCase()) : 'News'

  const handleShopClick = () => {
    if (item.shop_id && item.shop) {
      handleShopSelect(formatDBShopAsFeature(item.shop))
    }
  }

  return (
    <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 p-4">
      <span className="text-xs font-bold uppercase tracking-wide text-amber-700">{label}</span>

      <p className="mt-2 text-gray-900">{item.description ?? item.title}</p>

      {item.shop_id && item.shop && (
        <button
          onClick={handleShopClick}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-900"
        >
          View {item.shop.name}
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
