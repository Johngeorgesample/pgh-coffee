import { TShop } from '@/types/shop-types'
import { TUnits } from '@/types/unit-types'
import useShopsStore from '@/stores/coffeeShopsStore'
import { useShopSelection } from '@/hooks'

interface IProps {
  distance?: string
  handleKeyPress: (event: React.KeyboardEvent<HTMLLIElement>, shop: TShop) => any
  shop: TShop
  units?: TUnits
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  featured?: boolean
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
  const { setHoveredShop } = useShopsStore()
  return (
    <li
      onMouseEnter={() => setHoveredShop(props.shop)}
      onMouseLeave={() => setHoveredShop(null)}
      className={`${props.featured ? 'h-46' : 'h-36'} relative mb-4 rounded-sm overflow-hidden shadow-md cursor-pointer`}
      onClick={() => handleShopSelect(props.shop)}
      onKeyDown={event => props.handleKeyPress(event, props.shop)}
      tabIndex={0}
      role="button"
    >
      {props.shop?.properties?.photo ? (
        <img
          className="h-full w-full relative object-cover object-center"
          decoding="async"
          loading="lazy"
          src={props.shop.properties.photo}
        />
      ) : (
        <div className="h-full relative bg-yellow-200 bg-cover bg-center" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.7),transparent_100%)]"></div>
      <div className="px-6 py-2 absolute bottom-0">
        <p className="font-medium text-white text-2xl text-left block">{props.shop.properties.name}</p>
        <p className="w-fit mb-1 text-left text-white border border-transparent">
          {props.shop.properties.neighborhood}
        </p>
        {props.distance && props.units && (
          <p className="italic text-sm text-white">
            {generateDistanceText({ units: props.units, distance: props.distance })}
          </p>
        )}
      </div>
    </li>
  )
}
