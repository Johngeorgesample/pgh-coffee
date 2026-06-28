import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { TShop } from '@/types/shop-types'
import { TUnits } from '@/types/unit-types'
import useShopsStore from '@/stores/coffeeShopsStore'
import { useShopSelection } from '@/hooks'
import { generateDistanceText } from '@/app/components/ShopCard'

interface IProps {
  shop: TShop
  distance?: string
  units?: TUnits
}

export default function NearbyShopRow(props: IProps) {
  const { handleShopSelect } = useShopSelection()
  const { setHoveredShop } = useShopsStore()

  const handleClick = () => handleShopSelect(props.shop)

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
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      tabIndex={0}
      role="button"
      className="group flex items-center gap-3 py-3 border-b border-stone-200 cursor-pointer"
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-gray-900">{props.shop.properties.name}</span>
        <span className="block truncate text-sm text-gray-500">{props.shop.properties.neighborhood}</span>
      </span>

      {props.distance && props.units && (
        <span className="shrink-0 text-sm text-gray-500">
          {generateDistanceText({ units: props.units, distance: props.distance })}
        </span>
      )}

      <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-gray-600" />
    </li>
  )
}
