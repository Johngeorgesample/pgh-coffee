'use client'

import { Explore } from '@/app/components/Explore'
import { usePanelStore } from '@/stores/panelStore'
import { TShop } from '@/types/shop-types'

interface IProps {
  children: any
  shop: TShop
  handlePanelContentClick: (shop: TShop) => void
}

export default function ShopPanel(props: IProps) {
  const { current, goBack, canGoBack } = usePanelStore()

  const renderContent = () => {
    if (current.content) return current.content
    if (current.mode === 'explore') return <Explore />
    return null
  }
  return (
    <div data-testid="shop-panel" className="relative z-10">
      <div className="fixed overflow-hidden">
        <div className="absolute overflow-hidden">
          <div className="w-full bottom-0 h-1/2 pointer-events-none fixed lg:w-1/3 lg:h-[calc(100%-4rem)] lg:inset-y-0 lg:top-16 lg:right-0 flex max-w-full">
            <div className="bg-neutral-50 overflow-y-auto pointer-events-auto w-screen lg:max-w-xl">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
