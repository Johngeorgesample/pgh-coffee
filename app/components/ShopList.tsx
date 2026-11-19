import { TShop } from '@/types/shop-types'
import { TUnits } from '@/types/unit-types'
import ShopCard from '@/app/components/ShopCard'

interface IProps {
  coffeeShops: TShop[]
  distances?: number[]
  units?: TUnits
  hideShopNames?: boolean
  isClosed?: (uuid: string) => boolean
}

export default function ShopList(props: IProps) {
  return (
    <ul className="relative mt-6 flex-1">
      {props.coffeeShops.map((shop: TShop, index) => {
        return (
          <ShopCard
            key={shop.properties.name + shop.properties.address}
            distance={props.distances?.[index] != null ? String(props.distances[index]) : undefined}
            hideShopName={props.hideShopNames}
            closedNow={props.isClosed?.(shop.properties.uuid)}
            shop={shop}
            units={props.units}
          />
        )
      })}
    </ul>
  )
}
