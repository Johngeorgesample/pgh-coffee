'use client'

import { MapPinIcon } from '@heroicons/react/24/outline'
import VerifiedBadge from './VerifiedBadge'
import { TShop } from '@/types/shop-types'
import { DISTANCE_UNITS, TUnits } from '@/types/unit-types'
import useShopsStore from '@/stores/coffeeShopsStore'
import { useShopSelection, useAnalytics } from '@/hooks'

interface IProps {
  distance?: string
  shop: TShop
  hideShopName?: boolean
  showAddress?: boolean
  units?: TUnits
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  featured?: boolean
  // Overrides the default map-selection click (store mutation + panel + analytics).
  // Used outside the map app — e.g. the public profile passport just navigates.
  onClick?: () => void
}

// Total over TUnits, so there is no unmatched branch that could render
// "undefined miles away".
export const roundDistance = ({ units, distance }: { units: TUnits; distance: number }) =>
  units === DISTANCE_UNITS.Miles ? Math.round(distance * 100) / 100 : Math.round(distance)

export const generateDistanceText = ({ units, distance }: { units: TUnits; distance: string }) => {
  const parsedDistance = parseFloat(distance)
  return `${roundDistance({ units, distance: parsedDistance })} ${units.toLowerCase()} away`
}

export default function ShopCard(props: IProps) {
  const plausible = useAnalytics()
  const { handleShopSelect } = useShopSelection()
  const setHoveredShop = useShopsStore(s => s.setHoveredShop)

  const handleClick = () => {
    if (props.onClick) {
      props.onClick()
      return
    }
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
      className={`${props.featured ? 'h-46' : 'h-28'} relative mb-4 rounded-sm overflow-hidden shadow-md cursor-pointer`}
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
      <div className="px-2 py-1 absolute bottom-0 w-full">
        {!props.hideShopName && (
          <p className="font-medium text-white text-2xl text-left flex items-center gap-1.5">
            <span className="truncate">{props.shop.properties.name}</span>
            {(props.shop.properties.verified || props.shop.properties.company?.is_verified) && <VerifiedBadge />}
          </p>
        )}
        <div className="flex justify-between mt-1">
          <p className="w-fit text-sm mb-1 text-left text-white border border-transparent flex items-center gap-1">
            <MapPinIcon className="h-4 w-4 shrink-0" />
            {props.showAddress ? props.shop.properties.address : props.shop.properties.neighborhood}
          </p>
          {props.distance && props.units && (
            <p className="italic text-sm text-white">
              {generateDistanceText({ units: props.units, distance: props.distance })}
            </p>
          )}
        </div>
      </div>
    </li>
  )
}
