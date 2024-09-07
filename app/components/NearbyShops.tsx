import { usePlausible } from 'next-plausible'
import { TShop } from '@/types/shop-types'
import shopGeoJSON from '@/data/coffee_shops.json'
import haversineDistance from 'haversine-distance'
import { DISTANCE_UNITS } from '@/app/settings/DistanceUnitsDialog'

interface IProps {
  handleClick: (shop: TShop) => void
  shop: TShop
}
export default function NearbyShops(props: IProps) {
  const plausible = usePlausible()
  const shopsAreClose = (shopA: any, shopB: any) => {
    return haversineDistance(shopA, shopB) < 1000
  }

  const isSameShop = (shopA: TShop, shopB: TShop) => {
    if (shopA.properties.address === shopB.properties.address) {
      return shopA.properties.name === shopB.properties.name
    }
    return false
  }

  const getNearbyShopsByDistance = () => {
    const shops = shopGeoJSON.features
    return shops.filter(
      s =>
        // @ts-ignore-next-line
        !isSameShop(s, props.shop) && shopsAreClose(s.geometry.coordinates, props.shop.geometry.coordinates),
    )
  }

  let nearbyList = getNearbyShopsByDistance()

  const sortShopsByDistance = (shops: any[], referenceCoordinates: any) => {
    return nearbyList.sort((shopA, shopB) => {
      // @ts-ignore-next-line
      const distanceA = haversineDistance(referenceCoordinates, shopA.geometry.coordinates)
      // @ts-ignore-next-line
      const distanceB = haversineDistance(referenceCoordinates, shopB.geometry.coordinates)
      return distanceA - distanceB
    })
  }

  const sortedList = sortShopsByDistance(nearbyList, props.shop.geometry.coordinates)

  const handleCardClick = (shop: TShop) => {
    props.handleClick(shop)
    plausible('NearbyCardClick', { props: {} })
  }

  const units = localStorage.getItem('distanceUnits')

  const getDistance = (shopACoord: any, shopBCoord: any) => {
    const meters = Math.round(haversineDistance(shopACoord, shopBCoord))
    const miles = Math.round((haversineDistance(shopACoord, shopBCoord) * 0.000621371 + Number.EPSILON) * 100) / 100
    return units === DISTANCE_UNITS.Miles ? miles : meters
  }

  if (nearbyList.length === 0) {
    return null
  }

  return (
    <section className="relative mt-6 flex-1 px-4 sm:px-6">
      <hr className="w-1/2 m-auto mt-2 mb-2" />
      <p className="mb-2 text-gray-700">Nearby shops</p>
      <ul>
        {sortedList.map((shop: any) => {
          return (
            <li
              key={shop.properties.name + shop.properties.address}
              className="relative mb-4 rounded overflow-hidden shadow-md hover:cursor-pointer"
              onClick={() => handleCardClick(shop)}
            >
              <div
                className="h-36 relative bg-yellow-200 bg-cover bg-center"
                style={shop.properties.photo && { backgroundImage: `url('${shop.properties.photo}')` }}
              />
              <div className="px-6 py-2">
                <p className="font-medium text-xl text-left block">{shop.properties.name}</p>
                <p className="w-fit mb-1 text-left text-gray-700 border border-transparent">
                  {shop.properties.neighborhood}
                </p>
                {/*<address className="text-gray-700">{shop.properties.address}</address> */}
                <p className="italic text-sm text-gray-700">
                  {getDistance(shop.geometry.coordinates, props.shop.geometry.coordinates)} {units?.toLowerCase()} away
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
