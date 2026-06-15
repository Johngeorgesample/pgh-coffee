import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAnalytics } from '@/hooks/useAnalytics'
import { TShop } from '@/types/shop-types'
import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'
import ShopDetails from '@/app/components/ShopDetails'
import { buildShopSlug } from '@/app/utils/shopSlug'

export function useShopSelection() {
  const plausible = useAnalytics()
  const router = useRouter()
  const { setCurrentShop, setSearchValue, clearAmenityFilters } = useShopsStore()
  const { setPanelContent } = usePanelStore()

  const navigateToShop = useCallback(
    (shop: TShop) => router.push(`/shops/${buildShopSlug(shop.properties)}`),
    [router],
  )

  const handleShopSelect = useCallback(
    (shop: TShop) => {
      setCurrentShop(shop)
      setSearchValue('')
      clearAmenityFilters()
      navigateToShop(shop)
      setPanelContent(<ShopDetails shop={shop} />, 'shop')

      document.getElementById('header')?.parentElement?.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      plausible('FeaturePointClick', {
        props: {
          shopName: shop.properties.name,
          neighborhood: shop.properties.neighborhood,
        },
      })
    },
    [navigateToShop, plausible, setCurrentShop, setSearchValue, clearAmenityFilters, setPanelContent],
  )

  return { handleShopSelect }
}
