import { memo } from 'react'
import { TShop } from '@/types/shop-types'
import PanelHeader from './PanelHeader'
import PanelContent from './PanelContent'
import PanelFooter from './PanelFooter'
import SearchBar from './SearchBar'

interface TProps {
  shop: TShop
  emitClose: () => void
  handlePanelContentClick: (shop: TShop) => void
  foo: () => void
}

const ShopDetails = memo((props: TProps) => {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <SearchBar value={props.shop.properties.name} onClose={props.foo} shop={props.shop}/>
      <PanelHeader shop={props.shop} />
      <PanelContent handleNearbyShopClick={props.handlePanelContentClick} shop={props.shop} />
      <PanelFooter shop={props.shop} />
    </div>
  )
})

ShopDetails.displayName = 'ShopDetails'
export default ShopDetails
