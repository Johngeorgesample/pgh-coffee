'use client'

interface IProps {
  onShopClick: Function
  shop: TShop
}

type TShop = {
  name: string,
  neighborhood: string, // @TODO should this be a union type?
  address: string,
  website: string, // @TODO how can I verify a URL is valid? Is that a fool's errand?
}

export default function ShopCard(props: IProps) {
  return (
    <div className="group rounded overflow-hidden shadow-md hover:bg-gray-100">
        <div className="px-6 py-4">
          <p className="font-bold text-xl mb-1 group-hover:underline">{props.shop.name}</p>
          <p className="w-fit text-gray-700 border border-transparent  hover:border-black hover:border-dashed hover:cursor-pointer" onClick={() => props.onShopClick(props.shop.neighborhood)}>{props.shop.neighborhood}</p>
          <address className="text-gray-700">{props.shop.address}</address>
        </div>
  </div>
  )
}
