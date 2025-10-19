import { useEffect, useRef } from 'react'
import { usePlausible } from 'next-plausible'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import useSearchStore from '@/stores/searchStore'
import { TShop } from '@/types/shop-types'
import useShopsStore from '@/stores/coffeeShopsStore'
import ShopList from '@/app/components/ShopList'
import {usePanelStore} from '@/stores/panelStore'

interface IProps {
  handleResultClick: (shop: TShop) => void
}

export default function ShopSearch(props: IProps) {
  const { searchValue } = useSearchStore()
  const { setPanel } = usePanelStore()
  const plausible = usePlausible()
  const inputRef = useRef<HTMLInputElement>(null)


  const handleCardClick = (shop: TShop) => {
    // @TODO reset filtered shops
    props.handleResultClick(shop)
    plausible('ShopSearchClick', {
      props: {
        shopName: shop.properties.name,
        neighborhood: shop.properties.neighborhood,
      },
    })
  }

  useEffect(() => {
    inputRef?.current?.focus()
  }, [])

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 sm:px-6">
      <ShopList handleCardClick={handleCardClick} />
    </div>
  )
}
