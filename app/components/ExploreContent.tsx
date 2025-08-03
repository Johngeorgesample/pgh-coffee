'use client'

import { CuratedListIndex } from './CuratedListIndex'
import usePanelStore from '@/stores/panelStore'
import ShopSearch from '@/app/components/ShopSearch'

interface IProps {}

export const ExploreContent = (props: IProps) => {
  const { setPanelContent } = usePanelStore()

  const sections = [
    { label: '🔥 Trending shops', onClick: () => {} },
    { label: '📍 Explore by neighborhood', onClick: () => {} },
    { label: '🆕 What\'s new', onClick: () => {} },
    { label: '☕️ Curated Lists', onClick: () => setPanelContent(<CuratedListIndex />, 'list') },
    { label: '🗺️ View all shops', onClick: () => setPanelContent(<ShopSearch />, 'search') },
  ]

  return (
    <div className="mt-20 px-4 sm:px-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Explore</h2>
      <div className="flex flex-col divide-y border rounded-md bg-white shadow-sm">
        {sections.map((section, idx) => (
          <button
            key={idx}
            onClick={section.onClick}
            className="text-left p-4 hover:bg-gray-50 transition text-gray-800"
          >
            {section.label}
          </button>
        ))}
      </div>
    </div>
  )
}
