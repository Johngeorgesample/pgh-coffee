
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { TShop } from '@/types/shop-types'

interface CurrentShopState {
  currentShop: TShop | null
  isLoading: boolean
  setCurrentShop: (shop: TShop | null) => void
  clearCurrentShop: () => void
}

const useCurrentShopStore = create<CurrentShopState>()(
  devtools(
    (set) => ({
      currentShop: null,
      isLoading: false,

      setCurrentShop: (shop: TShop | null) => {
        set({ currentShop: shop })
      },

      clearCurrentShop: () => set({ currentShop: null }),
    }),
    { name: 'CurrentShopStore' }
  )
)

export default useCurrentShopStore
