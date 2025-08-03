import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePlausible } from 'next-plausible'
import { TShop } from '@/types/shop-types'
import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'

export function useShopSelection() {
  const plausible = usePlausible()
  const router = useRouter()
  const { setCurrentShop } = useShopsStore()
  const { setSearchValue } = usePanelStore()

  const appendSearchParamToURL = useCallback((shop: TShop) => {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    params.set('shop', `${shop.properties.name}_${shop.properties.neighborhood}`)
    url.search = params.toString()
    router.push(url.toString())
  }, [router])

  const handleShopSelect = useCallback((properties: any, geometry: any, type: any) => {
    const shop = { properties, geometry, type } as TShop
    
    setCurrentShop(shop)
    setSearchValue(shop.properties.name)
    appendSearchParamToURL(shop)
    
    plausible('FeaturePointClick', {
      props: {
        shopName: properties.name,
        neighborhood: properties.neighborhood,
      },
    })
  }, [setCurrentShop, setSearchValue, appendSearchParamToURL, plausible])

  return { handleShopSelect }
}
