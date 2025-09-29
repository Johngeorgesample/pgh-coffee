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
      // @TODO
      // setSearchValue(shop.properties.name)
      appendSearchParamToURL(shop)
      setPanelContent(<ShopDetails shop={shop} emitClose={() => {}} />, 'shop')

      const isDesktop = window.matchMedia('(min-width: 1024px)').matches

      if (isDesktop) {
        document.querySelectorAll('*').forEach(el => {
          if (el.scrollTop > 0) {
            el.scrollTo({ top: 0, behavior: 'smooth' })
          }
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }

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
