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
    <div className="group relative rounded overflow-hidden shadow-md hover:bg-gray-100">
      <button className="w-fit absolute top-12 left-6 text-gray-700 border border-transparent hover:border-black hover:border-dashed hover:cursor-pointer" onClick={() => props.onShopClick(props.shop.neighborhood)}>{props.shop.neighborhood}</button>
      <a className="" href={props.shop.website} target="_blank">
        <div className="px-6 py-4">
          <p className="font-bold text-xl mb-1 group-hover:underline">{props.shop.name}</p>
          <address className="mt-8 text-gray-700">{props.shop.address}</address>
        </div>
      </a>
  </div>
  )
}
