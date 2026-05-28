import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { useAnalytics } from '@/hooks'
import { TShop } from '@/types/shop-types'
import { TUnits } from '@/types/unit-types'
import useShopsStore from '@/stores/coffeeShopsStore'
import haversineDistance from 'haversine-distance'
import { DISTANCE_UNITS } from '@/app/utils/distance'
import ShopList from '@/app/components/ShopList'

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
const DEFAULT_UNITS: TUnits = 'miles'

const subscribeToDistanceUnits = (callback: () => void) => {
  const handler = (event: StorageEvent) => {
    if (event.key === 'distanceUnits') callback()
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}

const getDistanceUnitsSnapshot = (): TUnits => {
  return (localStorage.getItem('distanceUnits') as TUnits) || DEFAULT_UNITS
}

const getDistanceUnitsServerSnapshot = (): TUnits => DEFAULT_UNITS

export default function NearbyShops({ shop }: IProps) {
  useAnalytics()
  const { allShops } = useShopsStore()

  const units = useSyncExternalStore(
    subscribeToDistanceUnits,
    getDistanceUnitsSnapshot,
    getDistanceUnitsServerSnapshot,
  )

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

    const nearby: IShopWithDistance[] = []
    for (const s of allShops.features as TShop[]) {
      const isDifferentShop =
        s.properties.address !== shop.properties.address || s.properties.name !== shop.properties.name
      const meters = haversineDistance(s.geometry.coordinates, shop.geometry.coordinates)
      if (isDifferentShop && meters < 1000) {
        nearby.push({
          shop: s,
          distance: calculateDistance(shop.geometry.coordinates, s.geometry.coordinates),
        })
      }
    }

    nearby.sort((a, b) => a.distance - b.distance)

    return nearby.reduce(
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
      <p className="mb-2 text-gray-700">Nearby shops</p>
      <ShopList
        coffeeShops={sortedShopsWithDistances.shops}
        distances={sortedShopsWithDistances.distances}
        units={units}
      />
    </section>
  )
}
