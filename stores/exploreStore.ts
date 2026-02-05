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
  eventsError: string | null
  eventsLoading: boolean
  fetchEvents: () => Promise<void>

  news: NewsItem[] | null
  newsError: string | null
  newsLoading: boolean
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
      eventsError: null,
      eventsLoading: true,

      fetchEvents: async () => {
        const { events, eventsError } = get()
        if (events !== null || eventsError !== null) {
          return
        }
        try {
          const res = await fetch('/api/events', { cache: 'no-store' })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const data = await res.json()
          set({ events: data, eventsLoading: false })
        } catch (e: any) {
          set({ eventsError: e?.message ?? 'Failed to load events', eventsLoading: false })
        }
      },

      news: null,
      newsError: null,
      newsLoading: true,

      fetchNews: async () => {
        const { news, newsError } = get()
        if (news !== null || newsError !== null) {
          return
        }
        try {
          const res = await fetch('/api/updates', { cache: 'no-store' })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const data = await res.json()
          set({ news: data ?? [], newsLoading: false })
        } catch (e: any) {
          set({ newsError: e?.message ?? 'Failed to load news', newsLoading: false })
        }
      },
    }),
    { name: 'ExploreStore' },
  ),
)

export default useExploreStore
