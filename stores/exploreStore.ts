import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { TShop } from '@/types/shop-types'
import { EventCardData } from '@/app/components/EventCard'
import { NewsItem } from '@/types/news-types'

interface ExploreState {
  featuredShop: TShop | null
  featuredShopError: string | null
  featuredShopLoading: boolean
  fetchFeaturedShop: () => Promise<void>

  events: EventCardData[] | null
  fetchEvents: () => Promise<void>

  news: NewsItem[] | null
  fetchNews: () => Promise<void>
}

const useExploreStore = create<ExploreState>()(
  devtools(
    (set, get) => ({
      featuredShop: null,
      featuredShopError: null,
      featuredShopLoading: true,

      fetchFeaturedShop: async () => {
        const { featuredShop, featuredShopError } = get()
        if (featuredShop !== null || featuredShopError !== null) {
          return
        }
        try {
          const res = await fetch('/api/featured-shop', { cache: 'no-store' })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const data: TShop = await res.json()
          set({ featuredShop: data, featuredShopLoading: false })
        } catch (e: any) {
          set({ featuredShopError: e?.message ?? 'Failed to load featured shop', featuredShopLoading: false })
        }
      },

      events: null,

      fetchEvents: async () => {
        if (get().events !== null) {
          return
        }
        try {
          const res = await fetch('/api/events', { cache: 'no-store' })
          const data = await res.json()
          set({ events: data })
        } catch (e) {
          console.error('Error fetching events:', e)
          set({ events: [] })
        }
      },

      news: null,

      fetchNews: async () => {
        if (get().news !== null) {
          return
        }
        try {
          const res = await fetch('/api/updates')
          const data = await res.json()
          set({ news: data ?? [] })
        } catch (e) {
          console.error('Error fetching news:', e)
          set({ news: [] })
        }
      },
    }),
    { name: 'ExploreStore' },
  ),
)

export default useExploreStore
