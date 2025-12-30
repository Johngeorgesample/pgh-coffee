'use client'

import usePanelStore from '@/stores/panelStore'
import { News } from '@/app/components/News'
import ShopSearch from '@/app/components/ShopSearch'
import { CuratedListIndex } from '../CuratedListIndex'

export const CTAPhotoGrid = () => {
  const { setPanelContent } = usePanelStore()

  const items = [
    {
      title: '🔥 Trending',
      description: 'See what’s popular now',
      image: 'trending.png',
      onClick: () => {
        setPanelContent(<ShopSearch />, 'search')
      },
    },
    {
      title: '🆕 What’s New',
      description: 'Openings & updates',
      image: 'news.png',
      onClick: () => {
        setPanelContent(<News />, 'news')
      },
    },
    {
      title: '☕️ Curated Lists',
      description: 'Hand-picked spots',
      image: 'lists.png',
      onClick: () => {
        setPanelContent(<CuratedListIndex />, 'list')
      },
    },
  ]

  const generateClass = (idx: number) => {
    if (idx === 0) {
      return 'relative col-span-1 sm:col-span-2 h-48 sm:h-64 min-h-40 rounded-md overflow-hidden group'
    }
    return 'relative h-40 min-h-40 rounded-md overflow-hidden group'
  }

  return (
    <>
      {items.map((item, idx) => {
        return (
          <button key={item.title} onClick={item.onClick} className={generateClass(idx)}>
            <img
              src={item.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover  transition-transform"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
            <div className="relative z-10 flex flex-col justify-end h-full p-4 text-white">
              <span className="text-sm font-medium">{item.title}</span>
              <span className="text-2xl font-bold">{item.description}</span>
            </div>
          </button>
        )
      })}
    </>
  )
}
