import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { TShop } from '@/types/shop-types'
import { usePanelStore } from './panelStore' // adjust path as needed
import ShopDetails from '../app/components/ShopDetails' 

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
        if (shop) {
          console.log('do plausible')
          usePanelStore.getState().setPanel(
            'shop-details',
            <ShopDetails shop={shop} />,
          )
        }
      },
      clearCurrentShop: () => set({ currentShop: null }),
    }),
    { name: 'CurrentShopStore' }
  )
)

export default useCurrentShopStore
