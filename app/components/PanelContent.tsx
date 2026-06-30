import { TShop } from '@/types/shop-types'
import NearbyShops from './NearbyShops'
import { ShopNews } from './ShopNews'
import { ShopEvents } from './ShopEvents'
import QuickActionsBar from './QuickActionsBar'
import ClaimShopButton from './ClaimShopButton'
import ShopLocation from './ShopLocation'
import ShopRoaster from './ShopRoaster'
import PhotoGrid from './PhotoGrid'
import ShopAmenities from './ShopAmenities'
import ShopHours from './ShopHours'

interface IProps {
  shop: TShop
}

export default function PanelContent(props: IProps) {
  const { address, photos, amenities, roaster, uuid, name, neighborhood, company } = props.shop.properties
  const description = props.shop.properties.description?.trim()
  const coordinates = props.shop.geometry?.coordinates

  return (
    <div className="bg-[#FAF9F7] mb-8">
      <QuickActionsBar shop={props.shop} />

      <div className="px-4 sm:px-6 py-5 border-b border-stone-200">
        {description && <p className="text-sm text-gray-600 leading-relaxed">{description}</p>}
        <div className={description ? 'mt-4' : ''}>
          <ClaimShopButton shopUUID={uuid} shopName={name} neighborhood={neighborhood} companyName={company?.name} />
        </div>
      </div>

      {roaster && (
        <div className="px-4 sm:px-6 py-5 border-b border-stone-200">
          <ShopRoaster roaster={roaster} />
        </div>
      )}

      <ShopHours shop={props.shop} />

      {photos && <PhotoGrid photos={photos} />}

      {amenities && amenities?.length > 0 && (
        <div className="px-4 sm:px-6 py-5 border-b border-stone-200">
          <ShopAmenities amenities={amenities ?? []} shopId={props.shop.properties.uuid} />
        </div>
      )}

      <ShopNews shop={props.shop} />
      <ShopEvents shop={props.shop} />

      <div className="px-4 sm:px-6 py-5 border-b border-stone-200">
        <ShopLocation address={address} coordinates={coordinates} />
      </div>

      <NearbyShops shop={props.shop} />
    </div>
  )
}
