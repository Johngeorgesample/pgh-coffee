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
    <div className="w-56 h-56 border">
      <p>{props.shop.name}</p>
      <p>{props.shop.neighborhood}</p>
      <p>{props.shop.address}</p>
    </div>
  )
}
