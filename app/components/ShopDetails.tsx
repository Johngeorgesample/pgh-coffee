import { memo } from 'react'
import { TShop } from '@/types/shop-types'
import PanelHeader from './PanelHeader'
import PanelContent from './PanelContent'
import PanelFooter from './PanelFooter'

interface TProps {
  shop: TShop
  emitClose: () => void
  handlePanelContentClick: (shop: TShop) => void
}

const ShopDetails = memo((props: TProps) => {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <PanelHeader shop={props.shop} emitClose={props.emitClose} />
      <PanelContent handleNearbyShopClick={props.handlePanelContentClick} shop={props.shop} />
      <PanelFooter shop={props.shop} />
    </div>
  )
})

export default ShopDetails
