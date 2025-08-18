'use client'

import { CuratedListIndex } from './CuratedListIndex'
import usePanelStore from '@/stores/panelStore'
import ShopSearch from '@/app/components/ShopSearch'
import { News } from '@/app/components/News'
import { Events } from '@/app/components/Events'
import ShopCard from './ShopCard'

export const ExploreContent = () => {
  const { setPanelContent } = usePanelStore()

  const openNews = () => setPanelContent(<News />, 'news')
  const openLists = () => setPanelContent(<CuratedListIndex />, 'list')
  const openSearch = () => setPanelContent(<ShopSearch />, 'search')
  const openEvents = () => setPanelContent(<Events />, 'events')

  const myShop = {
    type: 'Feature',
    properties: {
      name: 'Espresso A Mano',
      neighborhood: 'Lower Lawrenceville',
      website: 'https://espressoamano.com/',
      address: '3623 Butler St, Pittsburgh, PA 15201',
      roaster: '',
      photo:
        'https://uljutxoijtvtcxvatqso.supabase.co/storage/v1/object/public/shop-photos/lower_lawrenceville/espresso_a_mano.jpg',
      uuid: 'f53cfca8-a38f-4992-b4f9-69f31753e225',
    },
    geometry: {
      type: 'Point',
      coordinates: [-79.96512525, 40.466097],
    },
  }

  return (
    <div className="mt-12 px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Featured section */}
        <button
          onClick={openSearch}
          className="relative col-span-1 sm:col-span-2 h-48 sm:h-64 rounded-xl overflow-hidden group"
        >
          <img
            src="trending.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
          <div className="relative z-10 flex flex-col justify-end h-full p-4 text-white">
            <span className="text-sm font-medium">🔥 Trending</span>
            <span className="text-2xl font-bold">See what’s popular now</span>
          </div>
        </button>

        {/* News & openings */}
        <button onClick={openNews} className="relative h-40 rounded-xl overflow-hidden group">
          <img
            src="news.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
          <div className="relative z-10 p-4 text-white">
            <span className="text-sm font-medium">🆕 What’s New</span>
            <span className="block text-lg font-bold">Openings & updates</span>
          </div>
        </button>

        {/* Curated lists */}
        <button onClick={openLists} className="relative h-40 rounded-xl overflow-hidden group">
          <img
            src="lists.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
          <div className="relative z-10 p-4 text-white">
            <span className="text-sm font-medium">☕️ Curated Lists</span>
            <span className="block text-lg font-bold">Hand-picked spots</span>
          </div>
        </button>

        {/* Events */}
        <div className="sm:col-span-2">
          <div className="bg-yellow-50 rounded-xl p-4">
            <h3 className="text-lg font-bold mb-2">Upcoming Events</h3>
            <p className="text-sm text-gray-700 mb-4">Latte art throwdowns, pop-ups, and more.</p>
            <button onClick={openEvents} className="text-yellow-800 font-medium hover:underline">
              Browse all events →
            </button>
          </div>
        </div>


        {/* Featured shop */}
        <div className="sm:col-span-2">
          <h3 className="text-lg font-bold mb-2">Featured shop</h3>

          <div className="list-none">
            <ShopCard shop={myShop} handleKeyPress={() => {}} />
          </div>
        </div>
      </div>
    </div>
  )
}
