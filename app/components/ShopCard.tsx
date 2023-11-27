interface IProps {
  shop: TShop
}

type TShop = {
  name: string,
  neighborhood: string,
  address: string,
  website: string,
}

export default function ShopCard(props: IProps) {
  return (
    <div className="group rounded overflow-hidden shadow-md hover:bg-gray-100">
      <a className="" href={props.shop.website} target="_blank">
        <div className="px-6 py-4">
          <p className="font-bold text-xl mb-1 group-hover:underline">{props.shop.name}</p>
          <p className="text-gray-700">{props.shop.neighborhood}</p>
          <address className="text-gray-700">{props.shop.address}</address>
        </div>
      </a>
  </div>
  )
}
