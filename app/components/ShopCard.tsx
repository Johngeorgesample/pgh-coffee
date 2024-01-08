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
    <div className="relative rounded overflow-hidden shadow-md">
        <div className="px-6 py-4">
          <a className="font-bold text-xl mb-1 block hover:underline" href={props.shop.website} target="_blank">{props.shop.name}</a>
          <button className="w-fit mb-1 text-left text-gray-700 border border-transparent hover:border-black hover:border-dashed hover:cursor-pointer" onClick={() => props.onShopClick(props.shop.neighborhood)}>{props.shop.neighborhood}</button>
          <address className="text-gray-700">{props.shop.address}</address>
        </div>
  </div>
  )
}
