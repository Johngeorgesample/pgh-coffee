import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { TFeatureCollection, TShop } from '@/types/shop-types'

interface CoffeeShopsState {
  allShops: TFeatureCollection
  fetchCoffeeShops: () => Promise<void>
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
    set => ({
      allShops: {
        type: 'FeatureCollection',
        features: [],
      },

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
          }
        }),

      fetchCoffeeShops: async () => {
        try {
          const response = await fetch('/api/shops/geojson')
          const data: TFeatureCollection = await response.json()
          set({ allShops: data })
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
    { name: 'ShopsStore' },
  ),
)

export default useCoffeeShopsStore
