import { TShop } from '@/types/shop-types'
import { TUnits } from '@/types/unit-types'
import ShopCard from '@/app/components/ShopCard'
import useSearchStore from '@/stores/searchStore'
import useShopsStore from '@/stores/coffeeShopsStore'

interface IProps {
  coffeeShops: TShop[]
  distances?: number[]
  handleCardClick?: (shop: TShop) => void
  units?: TUnits
}

export default function ShopList(props: IProps) {
  const { getFilteredShops } = useSearchStore()

  const handleKeyPress = (event: React.KeyboardEvent<HTMLLIElement>, shop: TShop) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      // props.handleCardClick(shop)
    }
  }

  const { coffeeShops } = useShopsStore()
  const filteredShops = getFilteredShops(coffeeShops.features)

  const foo = props.coffeeShops ?? filteredShops
  return (
    <ul className="relative mt-6 flex-1">
      {foo?.map((shop: TShop, index) => {
        return (
          <ShopCard
            key={shop.properties.name + shop.properties.address}
            distance={props.distances?.[index] != null ? String(props.distances[index]) : undefined}
            handleCardClick={props.handleCardClick}
            handleKeyPress={handleKeyPress}
            shop={shop}
            units={props.units}
          />
        )
      })}
    </ul>
  )
}
