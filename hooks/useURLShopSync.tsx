import { useEffect } from 'react'
import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'
import ShopDetails from '@/app/components/ShopDetails'

export const useURLShopSync = () => {
  const { setCurrentShop } = useShopsStore()
  const { setPanelContent } = usePanelStore()

  const fetchShopFromURL = async () => {
    const params = new URLSearchParams(window.location.search)
    const shop = params.get('shop')
    if (!shop) {
      setCurrentShop({} as any)
      return
    }

    try {
      const res = await fetch(`/api/shops/${shop}`)
      if (!res.ok) throw new Error('Shop not found')
      const data = await res.json()
      setCurrentShop(data)
      setPanelContent(<ShopDetails shop={data}  />, 'shop')
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchShopFromURL()
    window.addEventListener('popstate', fetchShopFromURL)
    return () => window.removeEventListener('popstate', fetchShopFromURL)
    // only run on mount
    // eslint-disable-next-line
  }, [])
}
