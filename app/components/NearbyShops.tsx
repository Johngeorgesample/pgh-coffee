import shopGeoJSON from '@/data/coffee_shops_geojson.json'
import haversineDistance from 'haversine-distance'

interface IProps {
  handleClick: any
  shop: any
}
export default function NearbyShops(props: IProps) {
  const shopsAreClose = (shopA: any, shopB: any) => {
    return haversineDistance(shopA, shopB) < 1000
  }

  const getNearbyShopsByDistance = () => {
    const shops = shopGeoJSON.features
    return shops.filter(
      s =>
        s.properties.address !== props.shop.properties.address &&
        shopsAreClose(s.geometry.coordinates, props.shop.geometry.coordinates),
    )
  }
  const nearbyList = getNearbyShopsByDistance()

  if (nearbyList.length === 0) {
    return null
  }

  return (
    <section className="relative mt-6 flex-1 px-4 sm:px-6">
      <hr className="w-1/2 m-auto mt-2 mb-2" />
      <p>Checkout these nearby shops!</p>
      <ul>
        {nearbyList.map((shop: any) => {
          return (
            <div key={shop.properties.address} className="relative mb-4 rounded overflow-hidden shadow-md hover:cursor-pointer" onClick={() => props.handleClick(shop)}>
              <div className="">
                  <div
                    className="h-36 relative bg-yellow-200 bg-cover bg-center"
                    style={
                      shop.properties.photo && { backgroundImage: `url('${shop.properties.photo}')` }
                    }
                  />
                <div className="px-6 py-2">
                  <p className="font-medium text-xl mb-1 text-left block">{shop.properties.name}</p>
                  <p className="w-fit mb-1 text-left text-gray-700 border border-transparent">
                    {shop.properties.neighborhood}
                  </p>
                  { /*<address className="text-gray-700">{shop.properties.address}</address> */}
                  <p>
                    {Math.round(haversineDistance(shop.geometry.coordinates, props.shop.geometry.coordinates))} meters
                    away
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </ul>
    </section>
  )
}