'use client'

import { useEffect } from 'react'
import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'
import ShopDetails from '@/app/components/ShopDetails'
import { TShop } from '@/types/shop-types'
import { buildShopSlug } from '@/app/utils/shopSlug'

// Seeds the store with the shop the server already fetched (for its 404 check)
// so useShopRouteSync short-circuits instead of re-fetching the same row over
// the API — saving a second DB lookup on direct/SSR loads. The guard skips
// re-seeding when client navigation (e.g. a map-pin click) already selected it.
export default function ShopSeed({ shop }: { shop: TShop }) {
  useEffect(() => {
    const { currentShop, setCurrentShop } = useShopsStore.getState()
    if (currentShop?.properties && buildShopSlug(currentShop.properties) === buildShopSlug(shop.properties)) {
      return
    }
    setCurrentShop(shop)
    usePanelStore.getState().setPanelContent(<ShopDetails shop={shop} />, 'shop')
  }, [shop])

  return null
}
