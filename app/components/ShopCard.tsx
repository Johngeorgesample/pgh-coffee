import { usePlausible } from 'next-plausible'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { TShop } from '@/types/shop-types'
import { TUnits } from '@/types/unit-types'
import useShopsStore from '@/stores/coffeeShopsStore'
import { useShopSelection } from '@/hooks'

interface IProps {
  distance?: string
  shop: TShop
  hideShopName?: boolean
  showAddress?: boolean
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
  const plausible = usePlausible()
  const { handleShopSelect } = useShopSelection()
  const { setHoveredShop } = useShopsStore()

  const handleClick = () => {
    if (props.featured) {
      plausible('FeaturedShopClick', {
        props: {
          shopName: props.shop.properties.name,
          neighborhood: props.shop.properties.neighborhood,
        },
      })
    }
    handleShopSelect(props.shop)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLLIElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <li
      onMouseEnter={() => setHoveredShop(props.shop)}
      onMouseLeave={() => setHoveredShop(null)}
      className={`${props.featured ? 'h-46' : 'h-24'} relative mb-4 rounded-sm overflow-hidden shadow-md cursor-pointer`}
      onClick={handleClick}
      onKeyDown={handleKeyPress}
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
        {!props.hideShopName && (
          <p className="font-medium text-white text-2xl text-left block">{props.shop.properties.name}</p>
        )}
        <p className="w-fit mb-1 text-left text-white border border-transparent flex items-center gap-1">
          <MapPinIcon className="h-4 w-4" />
          {props.shop.properties.neighborhood}
        </p>
        {props.showAddress && (
          <p className="w-fit mb-1 text-left text-white">
            {props.shop.properties.address}
          </p>
        )}
        {props.distance && props.units && (
          <p className="italic text-sm text-white">
            {generateDistanceText({ units: props.units, distance: props.distance })}
          </p>
        )}
      </div>
    </li>
  )
}
