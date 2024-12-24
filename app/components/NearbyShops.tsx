import { useCallback, useMemo, useState, useEffect } from 'react'
import { usePlausible } from 'next-plausible'
import { TShop } from '@/types/shop-types'
import useShopsStore from '@/stores/coffeeShopsStore'
import haversineDistance from 'haversine-distance'
import { DISTANCE_UNITS } from '@/app/settings/DistanceUnitsDialog'
import ShopList from '@/app/components/ShopList'

interface IProps {
  handleClick: (shop: TShop) => void
  shop: TShop
}

const MILES_CONVERSION_FACTOR = 0.000621371

export default function NearbyShops({ handleClick, shop }: IProps) {
  const plausible = usePlausible()
  const { coffeeShops } = useShopsStore()

  const [units, setUnits] = useState<string | null>(null)
  useEffect(() => {
    setUnits(localStorage.getItem('distanceUnits'))
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
    if (!coffeeShops.features) return { shops: [], distances: [] }

    return coffeeShops.features
      .filter(
        (s: TShop) =>
          s.properties.address !== shop.properties.address &&
          haversineDistance(s.geometry.coordinates, shop.geometry.coordinates) < 1000,
      )
      .map((s: TShop) => ({
        shop: s,
        distance: calculateDistance(shop.geometry.coordinates, s.geometry.coordinates),
      }))
      .sort((a: any, b: any) => a.distance - b.distance)
      .reduce(
        (acc: any, { shop, distance }: any) => {
          acc.shops.push(shop)
          acc.distances.push(distance)
          return acc
        },
        { shops: [] as TShop[], distances: [] as number[] },
      )
  }, [coffeeShops, shop, calculateDistance])

  const handleCardClick = (shop: TShop) => {
    handleClick(shop)
    plausible('NearbyCardClick', { props: {
          shopName: shop.properties.name,
          neighborhood: shop.properties.neighborhood,
    } })
  }

  if (sortedShopsWithDistances.shops.length === 0) return null

  return (
    <section className="relative mt-3 flex-1 px-4 sm:px-6">
      <hr className="w-1/2 m-auto mt-2 mb-2" />
      <p className="mb-2 text-gray-700">Nearby shops</p>
      <ShopList
        coffeeShops={sortedShopsWithDistances.shops}
        distances={sortedShopsWithDistances.distances}
        handleCardClick={handleCardClick}
        units={units}
      />
    </section>
  )
}
