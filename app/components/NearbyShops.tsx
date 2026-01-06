import { useCallback, useMemo, useState, useEffect } from 'react'
import { usePlausible } from 'next-plausible'
import { TShop } from '@/types/shop-types'
import { TUnits } from '@/types/unit-types'
import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'
import haversineDistance from 'haversine-distance'
import { DISTANCE_UNITS } from '@/app/settings/DistanceUnitsDialog'
import ShopDetails from './ShopDetails'

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
  const plausible = usePlausible()
  const { allShops } = useShopsStore()
  const { setPanelContent } = usePanelStore()
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
      .slice(0, 6) // Limit to 6 nearby shops
      .reduce(
        (acc: ISortedShopsResults, { shop, distance }: IShopWithDistance) => {
          acc.shops.push(shop)
          acc.distances.push(distance)
          return acc
        },
        { shops: [] as TShop[], distances: [] as number[] },
      )
  }, [allShops, shop, calculateDistance])

  const handleShopClick = (nearbyShop: TShop) => {
    plausible('NearbyShopClick', {
      props: {
        fromShop: shop.properties.name,
        toShop: nearbyShop.properties.name,
      },
    })
    setPanelContent(<ShopDetails shop={nearbyShop} />, 'shop')
  }

  const formatDistance = (distance: number) => {
    return units === DISTANCE_UNITS.Miles
      ? `${distance.toFixed(2)} mi`
      : `${Math.round(distance)} m`
  }

  if (sortedShopsWithDistances.shops.length === 0) return null

  return (
    <section className="py-5">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-3 px-4 sm:px-6">
        Nearby Shops
      </h2>
      
      <div 
        className="flex gap-3 overflow-x-auto px-4 sm:px-6 pb-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {sortedShopsWithDistances.shops.map((nearbyShop, index) => (
          <button
            key={`${nearbyShop.properties.name}-${nearbyShop.properties.address}`}
            onClick={() => handleShopClick(nearbyShop)}
            className="flex-shrink-0 w-36 text-left group"
          >
            {/* Image */}
            <div className="w-36 h-24 rounded-xl overflow-hidden mb-2 bg-stone-200">
              {nearbyShop.properties.photo ? (
                <img
                  src={nearbyShop.properties.photo}
                  alt={nearbyShop.properties.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Info */}
            <h3 className="text-sm font-semibold text-stone-800 leading-tight line-clamp-2 group-hover:text-amber-700 transition-colors">
              {nearbyShop.properties.name}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {nearbyShop.properties.neighborhood}
              <span className="mx-1">·</span>
              {formatDistance(sortedShopsWithDistances.distances[index])}
            </p>
          </button>
        ))}
      </div>
    </section>
  )
}
