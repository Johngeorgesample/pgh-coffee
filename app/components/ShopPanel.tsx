'use client'

import { TShop } from '@/types/shop-types'

interface IProps {
  children: any
  shop: TShop
  handlePanelContentClick: (shop: TShop) => void
}

export default function ShopPanel(props: IProps) {
  return (
    <div data-testid="shop-panel" className="relative z-10">
      <div className="fixed" />
      <div className="fixed overflow-hidden">
        <div className="absolute overflow-hidden">
          <div className="w-full bottom-0 h-1/2 pointer-events-none fixed lg:w-fit lg:h-[calc(100%-4rem-3.5rem)] lg:inset-y-0 lg:top-16 lg:right-0 flex max-w-full lg:pl-10">
            <div className="bg-neutral-50 overflow-y-auto pointer-events-auto w-screen lg:max-w-xl">
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
