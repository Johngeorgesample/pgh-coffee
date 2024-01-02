'use client'

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
  const filterByNeighborhood = () => {
    console.log(props.shop.neighborhood);
  }
  return (
    <div className="group rounded overflow-hidden shadow-md hover:bg-gray-100">
        <div className="px-6 py-4">
          <p className="font-bold text-xl mb-1 group-hover:underline">{props.shop.name}</p>
          <p className="w-fit text-gray-700 border border-transparent  hover:border-black hover:border-dashed hover:cursor-pointer">{props.shop.neighborhood}</p>
          <address className="text-gray-700">{props.shop.address}</address>
        </div>
  </div>
  )
}
