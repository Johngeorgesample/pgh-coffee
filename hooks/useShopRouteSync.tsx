import { useEffect } from 'react'
import { useParams, usePathname } from 'next/navigation'
import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'
import ShopDetails from '@/app/components/ShopDetails'
import { TShop } from '@/types/shop-types'
import { buildShopSlug } from '@/app/utils/shopSlug'

export const useShopRouteSync = () => {
  const { slug } = useParams<{ slug?: string }>()
  const pathname = usePathname()
  const { currentShop, setCurrentShop } = useShopsStore()
  const { setPanelContent } = usePanelStore()

  // `slug` is shared by every [slug] route (shops, events, news), so only act
  // when we're actually on a shop page.
  const onShopRoute = pathname.startsWith('/shops/')

  useEffect(() => {
    if (!onShopRoute || !slug) {
      if (currentShop?.properties?.uuid) {
        setCurrentShop({} as TShop)
      }
      return
    }

    if (currentShop?.properties && buildShopSlug(currentShop.properties) === slug) {
      return
    }

    fetch(`/api/shops/by-slug/${encodeURIComponent(slug)}`)
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('Shop not found'))))
      .then(data => {
        setCurrentShop(data)
        setPanelContent(<ShopDetails shop={data} />, 'shop')
      })
      .catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, onShopRoute])
}
