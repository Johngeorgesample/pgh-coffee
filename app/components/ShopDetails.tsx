import { TShop } from '@/types/shop-types'
import PanelHeader from './PanelHeader'
import PanelContent from './PanelContent'
import PanelFooter from './PanelFooter'

interface TProps {
  shop: TShop
  emitClose: Function
  handlePanelContentClick: (shop: TShop) => void
}

export default function ShopDetails(props: TProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <PanelHeader shop={props.shop} emitClose={props.emitClose} />
      <PanelContent handleNearbyShopClick={props.handlePanelContentClick} shop={props.shop} />
      <PanelFooter shop={props.shop} />
    </div>
  )
}
