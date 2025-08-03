import { TShop } from '@/types/shop-types'
import { TUnits } from '@/types/unit-types'
import ShopCard from '@/app/components/ShopCard'
import useShopsStore from '@/stores/coffeeShopsStore'

interface IProps {
  coffeeShops: TShop[]
  distances?: number[]
  filter?: string
  units?: TUnits
}

export default function ShopList(props: IProps) {
  const { setCurrentShop } = useShopsStore()
  const handleKeyPress = (event: React.KeyboardEvent<HTMLLIElement>, shop: TShop) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setCurrentShop(shop)
    }
  }

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
    <ul className="relative mt-6 flex-1">
      {props.coffeeShops.map((shop: TShop, index) => {
        if (doesShopMatchFilter(shop) || !props.filter) {
          return (
            <ShopCard
              key={shop.properties.name + shop.properties.address}
              distance={props.distances?.[index] != null ? String(props.distances[index]) : undefined}
              handleKeyPress={handleKeyPress}
              shop={shop}
              units={props.units}
            />
          )
        }
        return null
      })}
    </ul>
  )
}
