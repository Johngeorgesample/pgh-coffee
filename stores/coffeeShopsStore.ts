import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { TFeatureCollection, TShop } from '@/types/shop-types'

// Cache duration: 1 hour in milliseconds
const CACHE_DURATION = 3600000

interface CoffeeShopsState {
  allShops: TFeatureCollection
  lastFetched: number | null
  fetchCoffeeShops: (forceRefresh?: boolean) => Promise<void>
  setAllShops: (data: TShop[]) => void
  currentShop: TShop
  setCurrentShop: (data: TShop) => void
  hoveredShop: TShop | null
  setHoveredShop: (shop: TShop | null) => void
  displayedShops: TFeatureCollection
  setDisplayedShops: (shops: TFeatureCollection) => void
}

const useCoffeeShopsStore = create<CoffeeShopsState>()(
  devtools(
    (set, get) => ({
      allShops: {
        type: 'FeatureCollection',
        features: [],
      },

      lastFetched: null,

      setAllShops: (data: TShop[] | { type: string; features: TShop[] }) =>
        set(prev => {
          const isGeoJSON = typeof data === 'object' && 'type' in data && 'features' in data

          return {
            allShops: isGeoJSON
              ? (data as TFeatureCollection)
              : {
                  ...prev.allShops,
                  features: data as TShop[],
                },
            lastFetched: Date.now(),
          }
        }),

      fetchCoffeeShops: async (forceRefresh = false) => {
        const { lastFetched, allShops } = get()
        const now = Date.now()

        // Skip fetch if data exists and is still fresh (unless force refresh)
        if (
          !forceRefresh &&
          lastFetched &&
          allShops.features.length > 0 &&
          now - lastFetched < CACHE_DURATION
        ) {
          return
        }

        try {
          const response = await fetch('/api/shops/geojson')
          const data: TFeatureCollection = await response.json()
          set({ allShops: data, lastFetched: now })
        } catch (error) {
          console.error('Error fetching coffee shops:', error)
        }
      },

      currentShop: {} as TShop,

      setCurrentShop: (data: TShop) => set({ currentShop: data }),
      hoveredShop: null,
      setHoveredShop: shop => set({ hoveredShop: shop }),

      displayedShops: {
        type: 'FeatureCollection',
        features: [],
      },
      setDisplayedShops: (shops: TFeatureCollection) => set({ displayedShops: shops }),
    }),
    { name: 'ShopsStore', enabled: process.env.NODE_ENV === 'development' },
  ),
)

export default useCoffeeShopsStore
