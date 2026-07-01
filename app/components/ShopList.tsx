import { TShop } from '@/types/shop-types'
import { TUnits } from '@/types/unit-types'
import ShopCard from '@/app/components/ShopCard'

interface IProps {
  coffeeShops: TShop[]
  distances?: number[]
  units?: TUnits
  hideShopNames?: boolean
  layout?: 'column' | 'grid'
  cardWidth?: string
}

export default function ShopList(props: IProps) {
  const layout = props.layout ?? 'column'
  const isGrid = layout === 'grid'
  const cardWidth = isGrid ? (props.cardWidth ?? 'w-[calc(50%-0.5rem)]') : undefined

  return (
    <ul className={`relative mt-6 flex-1 ${isGrid ? 'flex flex-wrap gap-x-4' : ''}`}>
      {props.coffeeShops.map((shop: TShop, index) => {
        return (
          <ShopCard
            key={shop.properties.name + shop.properties.address}
            distance={props.distances?.[index] != null ? String(props.distances[index]) : undefined}
            hideShopName={props.hideShopNames}
            shop={shop}
            units={props.units}
            className={cardWidth}
          />
        )
      })}
    </ul>
  )
}
