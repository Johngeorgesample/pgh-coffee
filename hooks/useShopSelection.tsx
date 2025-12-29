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
  const { allShops, setCurrentShop, setDisplayedShops } = useShopsStore()
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
      setSearchValue('')
      appendSearchParamToURL(shop)
      setPanelContent(<ShopDetails shop={shop} />, 'shop')

      document.getElementById('header')?.parentElement?.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      setDisplayedShops(allShops)
      plausible('FeaturePointClick', {
        props: {
          shopName: shop.properties.name,
          neighborhood: shop.properties.neighborhood,
        },
      })
    },
    [appendSearchParamToURL, plausible, setCurrentShop, setSearchValue, setPanelContent],
  )

  return { handleShopSelect }
}
