import { memo } from 'react'
import { TShop } from '@/types/shop-types'
import { TUnits } from '@/types/unit-types'
import ShopCard from '@/app/components/ShopCard'
import { doesShopMatchFilter } from '@/app/utils/utils'

interface IProps {
  coffeeShops: TShop[]
  distances?: number[]
  filter?: string
  units?: TUnits
  hideShopNames?: boolean
}

function ShopList(props: IProps) {

  return (
    <ul className="relative mt-6 flex-1">
      {props.coffeeShops.map((shop: TShop, index) => {
        if (doesShopMatchFilter(shop.properties.name, shop.properties.neighborhood, props.filter)) {
          return (
            <ShopCard
              key={shop.properties.name + shop.properties.address}
              distance={props.distances?.[index] != null ? String(props.distances[index]) : undefined}
              hideShopName={props.hideShopNames}
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

export default memo(ShopList)
