import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { TShop } from '@/types/shop-types'

interface SearchState {
  searchValue: string

  setSearchValue: (value: string) => void
  getFilteredShops: (shops: TShop[]) => TShop[]
}

const useSearchStore = create<SearchState>()(
  devtools(
    (set, get) => ({
      searchValue: '',
      history: [],

      setSearchValue: value => set({ searchValue: value }),
      
      getFilteredShops: (shops: TShop[]) => {
        const { searchValue } = get()
        if (!searchValue.trim()) {
          return shops
        }
        
        return shops.filter((shop: TShop) => {
          const shopCardText = `${shop.properties.neighborhood.toLowerCase()} ${shop.properties.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')}`
          return shopCardText.includes(searchValue.toLowerCase())
        })
      },
    }),
    { name: 'SearchStore' },
  ),
)

export default useSearchStore
