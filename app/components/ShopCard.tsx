import { TShop } from '@/types/shop-types'
import { TUnits } from '@/types/unit-types'
import useShopsStore from '@/stores/coffeeShopsStore'
import {useShopSelection} from '@/hooks'

interface IProps {
  distance?: string
  handleKeyPress: (event: React.KeyboardEvent<HTMLLIElement>, shop: TShop) => any
  shop: TShop
  units?: TUnits
}

export const roundDistance = ({ units, distance }: { units: string; distance: number }) => {
  if (units === 'Miles') return Math.round(distance * 100) / 100
  if (units === 'Meters') return Math.round(distance)
}

export const generateDistanceText = ({ units, distance }: { units: string; distance: string }) => {
  const parsedDistance = parseFloat(distance)
  return `${roundDistance({ units, distance: parsedDistance })} ${units.toLowerCase()} away`
}

export default function ShopCard(props: IProps) {
  const { handleShopSelect } = useShopSelection()
  return (
    <li
      className="relative mb-4 rounded-sm overflow-hidden shadow-md cursor-pointer"
      onClick={() => handleShopSelect(props.shop)}
      onKeyDown={event => props.handleKeyPress(event, props.shop)}
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
        {props.distance && props.units && (
          <p className="italic text-sm text-gray-700">
            {generateDistanceText({ units: props.units, distance: props.distance })}
          </p>
        )}
      </div>
    </li>
  )
}
