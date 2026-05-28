import Image from 'next/image'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { TShop } from '@/types/shop-types'
import { TUnits } from '@/types/unit-types'
import useShopsStore from '@/stores/coffeeShopsStore'
import { useShopSelection, useAnalytics } from '@/hooks'
import { generateDistanceText } from '@/app/utils/distance'

interface IProps {
  distance?: string
  shop: TShop
  hideShopName?: boolean
  units?: TUnits
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  featured?: boolean
}

export default function ShopCard(props: IProps) {
  const plausible = useAnalytics()
  const { handleShopSelect } = useShopSelection()
  const { setHoveredShop } = useShopsStore()

  const openShopDetails = () => {
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

  return (
    <li
      onMouseEnter={() => setHoveredShop(props.shop)}
      onMouseLeave={() => setHoveredShop(null)}
      className={`${props.featured ? 'h-46' : 'h-28'} relative mb-4 rounded-sm overflow-hidden shadow-md`}
    >
      <button
        type="button"
        className="size-full cursor-pointer block text-left"
        onClick={openShopDetails}
      >
        {props.shop?.properties?.photo ? (
          <Image
            className="object-cover object-center"
            decoding="async"
            loading="lazy"
            src={props.shop.properties.photo}
            alt={props.shop.properties.name}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            unoptimized
          />
        ) : (
          <div className="h-full relative bg-yellow-200 bg-cover bg-center" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.7),transparent_100%)]"></div>
        <div className="px-2 py-1 absolute bottom-0 w-full">
          {!props.hideShopName && (
            <p className="font-medium text-white text-2xl text-left block">{props.shop.properties.name}</p>
          )}
          <div className="flex justify-between mt-1">
            <p className="w-fit text-sm mb-1 text-left text-white border border-transparent flex items-center gap-1">
              <MapPinIcon className="size-4" />
              {props.shop.properties.neighborhood}
            </p>
            {props.distance && props.units && (
              <p className="italic text-sm text-white">
                {generateDistanceText({ units: props.units, distance: props.distance })}
              </p>
            )}
          </div>
        </div>
      </button>
    </li>
  )
}
