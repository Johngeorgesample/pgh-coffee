import { TShop } from '@/types/shop-types'
import ShopCard from '@/app/components/ShopCard'

interface IProps {
  coffeeShops: TShop[]
  filter?: string
  handleCardClick: (shop: TShop) => any
  handleKeyPress: (event: React.KeyboardEvent<HTMLLIElement>, shop: TShop) => any
}

export default function ShopList(props: IProps) {
  const doesShopMatchFilter = (shop: TShop) => {
    if (props.filter) {
      const shopCardText = `${shop.properties.neighborhood.toLowerCase()} ${shop.properties.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')}`
      return shopCardText.includes(props.filter.toLowerCase())
    }
  }

  return (
    <ul className="relative mt-6 flex-1 px-4 sm:px-6">
      {props.coffeeShops.map((shop: TShop) => {
        if (doesShopMatchFilter(shop) || !props.filter) {
          return (
            <ShopCard
              key={shop.properties.name + shop.properties.address}
              shop={shop}
              handleCardClick={props.handleCardClick}
              handleKeyPress={props.handleKeyPress}
            />
          )
        }
      })}
    </ul>
  )
}
