import { useCallback, useMemo, useState, useEffect } from 'react'
import { useAnalytics } from '@/hooks'
import { TShop } from '@/types/shop-types'
import { TUnits } from '@/types/unit-types'
import useShopsStore from '@/stores/coffeeShopsStore'
import haversineDistance from 'haversine-distance'
import { DISTANCE_UNITS } from '@/app/settings/DistanceUnitsDialog'
import NearbyShopRow from '@/app/components/NearbyShopRow'

interface IProps {
  shop: TShop
}

interface IShopWithDistance {
  shop: TShop
  distance: number
}

interface ISortedShopsResults {
  shops: TShop[]
  distances: number[]
}

const MILES_CONVERSION_FACTOR = 0.000621371

export default function NearbyShops({ shop }: IProps) {
  const plausible = useAnalytics()
  const { allShops } = useShopsStore()

  const [units, setUnits] = useState<TUnits>('miles')
  useEffect(() => {
    setUnits(localStorage.getItem('distanceUnits') as TUnits)
  }, [])

  const calculateDistance = useCallback(
    (coordA: [number, number], coordB: [number, number]) => {
      const meters = haversineDistance(coordA, coordB)
      return units === DISTANCE_UNITS.Miles ? meters * MILES_CONVERSION_FACTOR : meters
    },
    [units],
  )

  const sortedShopsWithDistances = useMemo<{
    shops: TShop[]
    distances: number[]
  }>(() => {
    if (!allShops.features) return { shops: [], distances: [] }

    return allShops.features
      .filter((s: TShop) => {
        const isDifferentShop =
          s.properties.address !== shop.properties.address || s.properties.name !== shop.properties.name
        const distance = haversineDistance(s.geometry.coordinates, shop.geometry.coordinates)
        return isDifferentShop && distance < 1000
      })
      .map((s: TShop) => ({
        shop: s,
        distance: calculateDistance(shop.geometry.coordinates, s.geometry.coordinates),
      }))
      .sort((a: IShopWithDistance, b: IShopWithDistance) => a.distance - b.distance)
      .reduce(
        (acc: ISortedShopsResults, { shop, distance }: IShopWithDistance) => {
          acc.shops.push(shop)
          acc.distances.push(distance)
          return acc
        },
        { shops: [] as TShop[], distances: [] as number[] },
      )
  }, [allShops, shop, calculateDistance])

  if (sortedShopsWithDistances.shops.length === 0) return <div className="flex-1"></div>

  return (
    <section className="relative mt-3 flex-1 px-4 sm:px-6">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Nearby shops</p>
      <ul className="relative">
        {sortedShopsWithDistances.shops.map((s, index) => (
          <NearbyShopRow
            key={s.properties.name + s.properties.address}
            shop={s}
            distance={String(sortedShopsWithDistances.distances[index])}
            units={units}
          />
        ))}
      </ul>
    </section>
  )
}
