import { TShop } from '@/types/shop-types'

interface IProps {
  distance?: string
  handleCardClick: (shop: TShop) => any
  handleKeyPress: (event: React.KeyboardEvent<HTMLLIElement>, shop: TShop) => any
  shop: TShop
}

export default function ShopCard(props: IProps) {
  return (
    <li
      className="relative mb-4 rounded overflow-hidden shadow-md hover:cursor-pointer"
      onClick={() => props.handleCardClick(props.shop)}
      onKeyPress={event => props.handleKeyPress(event, props.shop)}
      tabIndex={0}
      role="button"
    >
      <div
        className="h-36 relative bg-yellow-200 bg-cover bg-center"
        style={props.shop.properties.photo ? { backgroundImage: `url('${props.shop.properties.photo}')` } : {}}
      />
      <div className="px-6 py-2">
        <p className="font-medium text-xl text-left block">{props.shop.properties.name}</p>
        <p className="w-fit mb-1 text-left text-gray-700 border border-transparent">
          {props.shop.properties.neighborhood}
        </p>
        {props.distance && (<p className="italic text-sm text-gray-700">
          {props.distance} away
        </p>)}
      </div>
    </li>
  )
}
