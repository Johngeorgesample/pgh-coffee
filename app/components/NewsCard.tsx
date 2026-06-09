'use client'
import { formatDBShopAsFeature } from '../utils/utils'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useShopSelection, useAnalytics } from '@/hooks'
import usePanelStore from '@/stores/panelStore'
import { NewsDetails } from './NewsDetails'
import { NewsItem, getTagStyle } from '@/types/news-types'
import { TagBadge } from './TagBadge'

type NewsCardProps = {
  item: NewsItem
  asLink?: boolean
  variant?: string
  showPastOpacity?: boolean
}

export const NewsCard = ({ item }: NewsCardProps) => {
  const { handleShopSelect } = useShopSelection()
  const { setPanelContent } = usePanelStore()
  const plausible = useAnalytics()
  const primaryTag = item.tags?.[0] ?? 'news'
  const styles = getTagStyle(primaryTag)
  const hasShop = !!(item.shop_id && item.shop)

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
    <article className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden flex flex-col transition-all hover:shadow-md">
      <div className={`p-5 border-l-[2px] ${styles.border}`}>
        <div className="mb-2">
          <TagBadge tag={primaryTag} variant="compact" />
        </div>

        <button
          type="button"
          onClick={handleCardClick}
          className="text-left w-full cursor-pointer"
        >
          <h3 className="text-xl font-bold mb-2 leading-tight text-gray-900">{item.title}</h3>

          {item.description && (
            <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-1">{item.description}</p>
          )}
        </button>

        {hasShop ? (
          <button
            type="button"
            onClick={handleShopClick}
            className="inline-flex items-center text-xs font-bold text-gray-900 hover:opacity-70 transition-opacity"
          >
            View {item.shop!.name}
            <ArrowRightIcon className="ml-1 size-3" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCardClick}
            className="inline-flex items-center text-xs font-bold text-gray-900 hover:opacity-70 transition-opacity"
          >
            Read more
            <ArrowRightIcon className="ml-1 size-3" />
          </button>
        )}
      </div>
    </article>
  )
}
