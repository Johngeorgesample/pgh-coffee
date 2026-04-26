import { TShop } from '@/types/shop-types'
import NearbyShops from './NearbyShops'
import { ShopNews } from './ShopNews'
import { ShopEvents } from './ShopEvents'
import QuickActionsBar from './QuickActionsBar'
import { getGoogleMapsUrl } from './DirectionsButton'
import PhotoGrid from './PhotoGrid'
import ShopAmenities from './ShopAmenities'
import { RoasterDetails } from './RoasterDetails'
import usePanelStore from '@/stores/panelStore'

interface IProps {
  shop: TShop
}

export default function PanelContent(props: IProps) {
  const { address, photos, amenities, roaster } = props.shop.properties
  const coordinates = props.shop.geometry?.coordinates
  const { setPanelContent } = usePanelStore()

  return (
    <div className="bg-[#FAF9F7]">
      <QuickActionsBar shop={props.shop} />

      <div className="px-4 sm:px-6 py-5">
        <a
          href={getGoogleMapsUrl({
            latitude: coordinates[0],
            longitude: coordinates[1],
          })}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <address className="not-italic text-sm font-medium text-stone-800 group-hover:text-amber-700 transition-colors leading-snug">
            {address}
          </address>
        </a>

        {roaster && (
          <p className="mt-2 text-xs text-stone-400">
            Beans:{' '}
            {roaster.is_local ? (
              <button
                className="hover:text-stone-600 transition-colors"
                onClick={() => setPanelContent(<RoasterDetails slug={roaster.slug} />, 'roaster')}
              >
                {roaster.name}
              </button>
            ) : roaster.website ? (
              <a
                href={roaster.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-stone-600 transition-colors"
              >
                {roaster.name}
              </a>
            ) : (
              roaster.name
            )}
          </p>
        )}

        <ShopAmenities
          amenities={amenities ?? []}
          shopId={props.shop.properties.uuid}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-stone-200 mx-4 sm:mx-6" />

      {/* Child components */}
      {photos && <PhotoGrid photos={photos} />}
      <ShopNews shop={props.shop} />
      <ShopEvents shop={props.shop} />
      <NearbyShops shop={props.shop} />
    </div>
  )
}
