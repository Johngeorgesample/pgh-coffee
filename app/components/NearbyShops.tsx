import { useMemo } from 'react'
import { TShop } from '@/types/shop-types'
import { metersToUnits } from '@/types/unit-types'
import useShopsStore from '@/stores/coffeeShopsStore'
import NearbyShopList from '@/app/components/NearbyShopList'
import { shopsByDistance } from '@/app/utils/shopsByDistance'
import { useDistanceUnits } from '@/hooks/useDistanceUnits'

interface IProps {
  shop: TShop
}

const NEARBY_METERS = 1000

export default function NearbyShops({ shop }: IProps) {
  const allShops = useShopsStore(s => s.allShops)
  const units = useDistanceUnits()

  const nearby = useMemo(
    () =>
      shopsByDistance(allShops.features ?? [], shop.geometry.coordinates).filter(
        ({ shop: s, meters }) => s.properties.uuid !== shop.properties.uuid && meters < NEARBY_METERS,
      ),
    [allShops, shop],
  )

  if (nearby.length === 0) return <div className="flex-1"></div>

  return (
    <section className="relative mt-3 flex-1 px-4 sm:px-6">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Nearby shops</p>
      <NearbyShopList
        shops={nearby.map(n => n.shop)}
        distances={nearby.map(n => metersToUnits(n.meters, units))}
        units={units}
      />
    </section>
  )
}
