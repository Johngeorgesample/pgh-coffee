import { memo } from 'react'
import { TShop } from '@/types/shop-types'
import PanelHeader from './PanelHeader'
import PanelContent from './PanelContent'

interface TProps {
  shop: TShop
}

const ShopDetails = memo((props: TProps) => {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <PanelHeader shop={props.shop} />
      <PanelContent shop={props.shop} />
    </div>
  )
})

ShopDetails.displayName = 'ShopDetails'
export default ShopDetails
