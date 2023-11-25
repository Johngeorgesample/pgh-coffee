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
    <a className="" href={props.shop.website} target="_blank">
      <div className="h-36 p-2 border hover:border-gray-600">
        <p>{props.shop.name}</p>
        <p>{props.shop.neighborhood}</p>
        <address>{props.shop.address}</address>
      </div>
    </a>
  )
}
