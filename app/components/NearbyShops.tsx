import { useCallback, useMemo, useState, useEffect } from 'react'
import { usePlausible } from 'next-plausible'
import { TShop } from '@/types/shop-types'
import useShopsStore from '@/stores/coffeeShopsStore'
import haversineDistance from 'haversine-distance'
import { DISTANCE_UNITS } from '@/app/settings/DistanceUnitsDialog'

interface IProps {
  handleClick: (shop: TShop) => void
  shop: TShop
}

export default function NearbyShops(props: IProps) {
  const plausible = usePlausible()
  const { coffeeShops } = useShopsStore()

  const shopsAreClose = useCallback(
    (shopA: [number, number], shopB: [number, number]) => haversineDistance(shopA, shopB) < 1000,
    [],
  )

  const isSameShop = useCallback(
    (shopA: TShop, shopB: TShop) =>
      shopA.properties.address === shopB.properties.address && shopA.properties.name === shopB.properties.name,
    [],
  )

  const nearbyList = useMemo(() => {
    return coffeeShops.features?.filter(
      (s: TShop) =>
        !isSameShop(s, props.shop) && shopsAreClose(s.geometry.coordinates, props.shop.geometry.coordinates),
    )
  }, [coffeeShops, props.shop, isSameShop, shopsAreClose])

  const sortedList = useMemo(() => {
    if (!nearbyList) return []
    return [...nearbyList].sort((shopA: TShop, shopB: TShop) => {
      const distanceA = haversineDistance(props.shop.geometry.coordinates, shopA.geometry.coordinates)
      const distanceB = haversineDistance(props.shop.geometry.coordinates, shopB.geometry.coordinates)
      return distanceA - distanceB
    })
  }, [nearbyList, props.shop.geometry.coordinates])

  const [units, setUnits] = useState<string | null>(null)
  useEffect(() => {
    setUnits(localStorage.getItem('distanceUnits'))
  }, [])

  const getDistance = (shopACoord: [number, number], shopBCoord: [number, number]) => {
    const meters = Math.round(haversineDistance(shopACoord, shopBCoord))
    const miles = Math.round((meters * 0.000621371 + Number.EPSILON) * 100) / 100
    return units === DISTANCE_UNITS.Miles ? miles : meters
  }

  const handleCardClick = (shop: TShop) => {
    props.handleClick(shop)
    plausible('NearbyCardClick', { props: {} })
  }

  if (nearbyList?.length === 0) {
    return null
  }

  return (
    <section className="relative mt-6 flex-1 px-4 sm:px-6">
      <hr className="w-1/2 m-auto mt-2 mb-2" />
      <p className="mb-2 text-gray-700">Nearby shops</p>
      <ul>
        {sortedList?.map((shop: TShop) => (
          <li
            className="relative mb-4 rounded overflow-hidden shadow-md hover:cursor-pointer"
            key={shop.properties.name + shop.properties.address}
            onClick={() => handleCardClick(shop)}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleCardClick(shop)
              }
            }}
            role="button"
            aria-label={`Nearby shop: ${shop.properties.name}, ${shop.properties.neighborhood}`}
          >
            <div
              className="h-36 relative bg-yellow-200 bg-cover bg-center"
              style={shop.properties.photo ? { backgroundImage: `url('${shop.properties.photo}')` } : undefined}
            />
            <div className="px-6 py-2">
              <p className="font-medium text-xl text-left block">{shop.properties.name}</p>
              <p className="w-fit mb-1 text-left text-gray-700 border border-transparent">
                {shop.properties.neighborhood}
              </p>
              <p className="italic text-sm text-gray-700">
                {getDistance(shop.geometry.coordinates, props.shop.geometry.coordinates)} {units?.toLowerCase()} away
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
