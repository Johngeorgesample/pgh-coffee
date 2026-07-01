'use client'
import { useRouter } from 'next/navigation'
import { formatDBShopAsFeature } from '../utils/utils'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useShopSelection, useAnalytics } from '@/hooks'
import usePanelStore from '@/stores/panelStore'
import { buildContentSlug } from '@/app/utils/slug'
import { NewsDetails } from './NewsDetails'
import { NewsItem, getTagStyle } from '@/types/news-types'
import { TagBadge } from './TagBadge'

// TODO: replace with a real `image_url` column on the updates table.
const HARDCODED_IMAGE =
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80'

type NewsCardProps = {
  item: NewsItem
  asLink?: boolean
  variant?: string
  showPastOpacity?: boolean
}

export const NewsCard = ({ item }: NewsCardProps) => {
  const { handleShopSelect } = useShopSelection()
  const { setPanelContent } = usePanelStore()
  const router = useRouter()
  const plausible = useAnalytics()
  const primaryTag = item.tags?.[0] ?? 'news'
  const styles = getTagStyle(primaryTag)
  const hasShop = !!(item.shop_id && item.shop)

  const handleCardClick = () => {
    if (item.id) {
      plausible('NewsCardClick', {
        props: { newsId: item.id, newsTitle: item.title },
      })
      router.push(`/news/${buildContentSlug({ id: item.id, title: item.title })}`)
      setPanelContent(<NewsDetails id={item.id} title={item.title} />, 'news')
    }
  }

  const handleShopClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (item.shop_id && item.shop) {
      handleShopSelect(formatDBShopAsFeature(item.shop))
    }
  }

  return (
    <article className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden flex transition-all hover:shadow-md">
      <button type="button" onClick={handleCardClick} className="shrink-0 cursor-pointer">
        <img src={HARDCODED_IMAGE} alt={item.title} className="w-28 h-full object-cover" />
      </button>
      <div className={`p-5 flex-1 min-w-0 border-l-[2px] ${styles.border}`}>
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
