import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { TFeatureCollection, TShop } from '@/types/shop-types'

interface CoffeeShopsState {
  allShops: TFeatureCollection
  searchValue: string
  fetchCoffeeShops: () => Promise<void>
  setAllShops: (data: TShop[]) => void
  currentShop: TShop
  setCurrentShop: (data: TShop) => void
  hoveredShop: TShop | null
  setHoveredShop: (shop: TShop | null) => void
}

const useCoffeeShopsStore = create<CoffeeShopsState>()(
  devtools(
    set => ({
      allShops: {
        type: 'FeatureCollection',
        features: [],
      },
      searchValue: '',

      setAllShops: (data: TShop[]) =>
        set({
          allShops: {
            type: 'FeatureCollection',
            features: data,
          },
        }),

      setSearchValue: (value: string) => set({ searchValue: value }),

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
    }),
    { name: 'ShopsStore' },
  ),
)

export default useCoffeeShopsStore
