import { TShop } from '@/types/shop-types'
import NearbyShops from './NearbyShops'
import { ShopNews } from './ShopNews'
import { ShopEvents } from './ShopEvents'
import QuickActionsBar from './QuickActionsBar'
import ShopLocation from './ShopLocation'
import ShopRoaster from './ShopRoaster'
import PhotoGrid from './PhotoGrid'
import ShopAmenities from './ShopAmenities'

interface IProps {
  shop: TShop
}

export default function PanelContent(props: IProps) {
  const { address, photos, amenities, roaster } = props.shop.properties
  const coordinates = props.shop.geometry?.coordinates

  return (
    <div className="bg-[#FAF9F7]">
      <QuickActionsBar shop={props.shop} />

      {roaster && (
        <div className="px-4 sm:px-6 py-5 border-b border-stone-200">
          <ShopRoaster roaster={roaster} />
        </div>
      )}

      {photos && <PhotoGrid photos={photos} />}

      <div className="px-4 sm:px-6 py-5 border-b border-stone-200">
        <ShopLocation address={address} coordinates={coordinates} />
      </div>

      <div className="px-4 sm:px-6 py-5">
        <ShopAmenities
          amenities={amenities ?? []}
          shopId={props.shop.properties.uuid}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-stone-200 mx-4 sm:mx-6" />

      {/* Child components */}
      <ShopNews shop={props.shop} />
      <ShopEvents shop={props.shop} />
      <NearbyShops shop={props.shop} />
    </div>
  )
}
