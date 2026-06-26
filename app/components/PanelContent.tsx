import { TShop } from '@/types/shop-types'
import NearbyShops from './NearbyShops'
import { ShopNews } from './ShopNews'
import { ShopEvents } from './ShopEvents'
import QuickActionsBar from './QuickActionsBar'
import ShopLocation from './ShopLocation'
import ShopRoaster from './ShopRoaster'
import PhotoGrid from './PhotoGrid'
import ShopAmenities from './ShopAmenities'
import ShopHours from './ShopHours'

interface IProps {
  shop: TShop
}

export default function PanelContent(props: IProps) {
  const { address, photos, amenities, roaster } = props.shop.properties
  const description = props.shop.properties.description?.trim()
  const coordinates = props.shop.geometry?.coordinates

  return (
    <div className="bg-[#FAF9F7]">
      <QuickActionsBar shop={props.shop} />

      {description && (
        <div className="px-4 sm:px-6 py-5 border-b border-stone-200">
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      )}

      {roaster && (
        <div className="px-4 sm:px-6 py-5 border-b border-stone-200">
          <ShopRoaster roaster={roaster} />
        </div>
      )}

      <ShopHours shop={props.shop} />

      {photos && <PhotoGrid photos={photos} />}

      <div className="px-4 sm:px-6 py-5">
        <ShopAmenities
          amenities={amenities ?? []}
          shopId={props.shop.properties.uuid}
        />
      </div>

      <ShopNews shop={props.shop} />
      <ShopEvents shop={props.shop} />

      <div className="h-px bg-stone-200 mx-4 sm:mx-6" />

      <div className="px-4 sm:px-6 py-5 border-b border-stone-200">
        <ShopLocation address={address} coordinates={coordinates} />
      </div>

      <NearbyShops shop={props.shop} />
    </div>
  )
}
