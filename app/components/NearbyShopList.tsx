import { TShop } from '@/types/shop-types'
import { TUnits } from '@/types/unit-types'
import NearbyShopRow from '@/app/components/NearbyShopRow'

interface IProps {
  shops: TShop[]
  distances: number[]
  units?: TUnits
}

export default function NearbyShopList(props: IProps) {
  return (
    <ul className="relative">
      {props.shops.map((shop, index) => (
        <NearbyShopRow
          key={shop.properties.name + shop.properties.address}
          shop={shop}
          distance={String(props.distances[index])}
          units={props.units}
        />
      ))}
    </ul>
  )
}
