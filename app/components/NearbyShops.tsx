interface IProps {
  shops: any
}
export default function NearbyShops(props: IProps) {
  console.log(props)
  return (
    <ul>
      {props.shops.map((shop: any) => {
        return (
          <div key={shop.properties.address} className="relative rounded overflow-hidden shadow-md">
            <div className="px-6 py-4">
              <p className="font-medium text-xl mb-1 text-left block hover:underline">{shop.properties.name}</p>
              <p className="w-fit mb-1 text-left text-gray-700 border border-transparent hover:border-black hover:border-dashed hover:cursor-pointer">
                {shop.properties.neighborhood}
              </p>
              <address className="text-gray-700">{shop.properties.address}</address>
            </div>
          </div>
        )
      })}
    </ul>
  )
}
