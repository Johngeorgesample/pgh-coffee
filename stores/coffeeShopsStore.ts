import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { TShop } from '@/types/shop-types'

interface CoffeeShopsState {
  coffeeShops: any
  searchValue: string
  fetchCoffeeShops: () => Promise<void>
  setCoffeeShops: (data: TShop[]) => void
  setSearchValue: (value: string) => void
}

const useCoffeeShopsStore = create<CoffeeShopsState>()(
  devtools(
    (set) => ({
      coffeeShops: {},
      searchValue: '',

      setCoffeeShops: (data: TShop[]) => set({ coffeeShops: data }),

      setSearchValue: (value: string) => set({ searchValue: value }),

      fetchCoffeeShops: async () => {
        try {
          const response = await fetch('/api/shops/geojson')
          const data = await response.json()
          set({ coffeeShops: data })
        } catch (error) {
          console.error('Error fetching coffee shops:', error)
        }
      }
    }),
    { name: 'ShopsStore' }
  )
)

export default useCoffeeShopsStore
