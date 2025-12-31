'use client'

import { NewsCard, NewsCardData } from './NewsCard'

interface NewsListProps {
  news: NewsCardData[]
  title?: string
  asLink?: boolean
  variant?: 'pill' | 'inline'
  clampDescription?: boolean
  showPastOpacity?: boolean
  emptyMessage?: string
}

export const NewsList = ({
  news,
  title,
  asLink = true,
  variant = 'pill',
  clampDescription = false,
  showPastOpacity = false,
  emptyMessage = 'No news to display',
}: NewsListProps) => {
  if (news.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-stone-500">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div>
      {title && (
        <div className="mb-3 flex items-center gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {title}
          </h2>
          <div className="h-px flex-1 bg-stone-200" />
        </div>
      )}

      <ul className="space-y-3">
        {news.map((item, index) => (
          <NewsCard
            key={index}
            item={item}
            asLink={asLink}
            variant={variant}
            clampDescription={clampDescription}
            showPastOpacity={showPastOpacity}
          />
        ))}
      </ul>
    </div>
  )
}
