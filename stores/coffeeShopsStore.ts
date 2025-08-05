import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { TShop } from '@/types/shop-types'

interface CoffeeShopsState {
  allShops: {}
  searchValue: string
  fetchCoffeeShops: () => Promise<void>
  setAllShops: (data: TShop[]) => void
  currentShop: TShop
  setCurrentShop: (data: TShop) => void
}

const useCoffeeShopsStore = create<CoffeeShopsState>()(
  devtools(
    set => ({
      allShops: {
        type: 'FeatureCollection',
        features: [],
      },
      searchValue: '',

      setAllShops: (data: TShop[]) => set({ allShops: data }),

      setSearchValue: (value: string) => set({ searchValue: value }),

      fetchCoffeeShops: async () => {
        try {
          const response = await fetch('/api/shops/geojson')
          const data = await response.json()
          set({ allShops: data })
        } catch (error) {
          console.error('Error fetching coffee shops:', error)
        }
      },

      currentShop: {} as TShop,

      setCurrentShop: (data: TShop) => set({ currentShop: data }),
    }),
    { name: 'ShopsStore' },
  ),
)

export default useCoffeeShopsStore
