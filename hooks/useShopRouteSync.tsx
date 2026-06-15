import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'
import ShopDetails from '@/app/components/ShopDetails'
import { TShop } from '@/types/shop-types'
import { buildShopSlug } from '@/app/utils/shopSlug'

export const useShopRouteSync = () => {
  const { slug } = useParams<{ slug?: string }>()
  const { currentShop, setCurrentShop } = useShopsStore()
  const { setPanelContent } = usePanelStore()

  useEffect(() => {
    if (!slug) {
      if (currentShop?.properties?.uuid) {
        setCurrentShop({} as TShop)
      }
      return
    }

    if (currentShop?.properties && buildShopSlug(currentShop.properties) === slug) {
      return
    }

    fetch(`/api/shops/by-slug/${slug}`)
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('Shop not found'))))
      .then(data => {
        setCurrentShop(data)
        setPanelContent(<ShopDetails shop={data} />, 'shop')
      })
      .catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])
}
