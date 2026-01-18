'use client'
import { formatDBShopAsFeature } from '../utils/utils'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useShopSelection } from '@/hooks'
import usePanelStore from '@/stores/panelStore'
import { NewsDetails } from './NewsDetails'
import { usePlausible } from 'next-plausible'
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
  const plausible = usePlausible()
  const primaryTag = item.tags?.[0] ?? 'news'
  const styles = getTagStyle(primaryTag)

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
      <div className={`p-5 border-l-[2px] ${styles.border}`}>
        <div className="mb-2">
          <TagBadge tag={primaryTag} variant="compact" />
        </div>

        <h3 className="text-xl font-bold mb-2 leading-tight text-gray-900">{item.title}</h3>

        {item.description && (
          <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-1">{item.description}</p>
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
