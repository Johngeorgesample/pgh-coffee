import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePlausible } from 'next-plausible'
import { TShop } from '@/types/shop-types'
import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'
import ShopDetails from '@/app/components/ShopDetails'

export function useShopSelection() {
  const plausible = usePlausible()
  const router = useRouter()
  const { setCurrentShop } = useShopsStore()
  const { setSearchValue, setPanelContent } = usePanelStore()

  const appendSearchParamToURL = useCallback(
    (shop: TShop) => {
      const url = new URL(window.location.href)
      const params = new URLSearchParams(url.search)
      params.set('shop', `${shop.properties.name}_${shop.properties.neighborhood}`)
      url.search = params.toString()
      router.push(url.toString())
    },
    [router],
  )

  const handleShopSelect = useCallback(
    (shop: TShop) => {
      setCurrentShop(shop)
      setSearchValue(shop.properties.name)
      appendSearchParamToURL(shop)
      setPanelContent(<ShopDetails shop={shop} emitClose={() => {}} />, 'shop')

      plausible('FeaturePointClick', {
        props: {
          shopName: shop.properties.name,
          neighborhood: shop.properties.neighborhood,
        },
      })
    },
    [setCurrentShop, setSearchValue, setPanelContent, appendSearchParamToURL, plausible],
  )

  return { handleShopSelect }
}
