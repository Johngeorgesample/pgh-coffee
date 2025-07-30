import { usePlausible } from 'next-plausible'
import { TShop } from '@/types/shop-types'
import useShopsStore from '@/stores/coffeeShopsStore'
import ShopList from '@/app/components/ShopList'

interface IProps {
  handleResultClick: (shop: TShop) => void
}

export default function ShopSearch(props: IProps) {
  const { coffeeShops, searchValue } = useShopsStore()
  const plausible = usePlausible()


  const handleCardClick = (shop: TShop) => {
    props.handleResultClick(shop)
    plausible('ShopSearchClick', {
      props: {
        shopName: shop.properties.name,
        neighborhood: shop.properties.neighborhood,
      },
    })
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 sm:px-6">
      <div className="mt-12">
        <ShopList coffeeShops={coffeeShops.features} filter={searchValue} handleCardClick={handleCardClick} />
      </div>
    </div>
  )
}
