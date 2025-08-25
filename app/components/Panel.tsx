'use client'

import { useState, useEffect } from 'react'
import { Sheet, useClientMediaQuery } from '@silk-hq/components'
import { TShop } from '@/types/shop-types'

import useShopStore from '@/stores/coffeeShopsStore'
import SearchBar from './SearchBar'

interface IProps {
  children: any
  shop: TShop
  foo: any
}

export default function Panel(props: IProps) {
  const currentShop = useShopStore(s => s.currentShop)
  const [presented, setPresented] = useState(false)
  const largeViewport = useClientMediaQuery('(min-width: 1024px)')

  useEffect(() => {
    if (currentShop && Object.keys(currentShop).length) {
      setPresented(true)
    } else {
      setPresented(false)
    }
  }, [currentShop])

  return largeViewport ? (
    <div data-testid="shop-panel" className="relative z-10">
      <div className="fixed overflow-hidden">
        <div className="absolute overflow-hidden">
          <div className="w-full bottom-0 h-full pointer-events-none fixed lg:w-1/3 lg:h-[calc(100%-4rem-3.5rem)] lg:inset-y-0 lg:top-16 lg:right-0 flex max-w-full">
            <div className="bg-neutral-50 overflow-y-auto pointer-events-auto w-screen lg:max-w-4xl">
              <SearchBar onClose={props.foo} />
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Sheet.Root
      presented={presented}
      onPresentedChange={next => {
        setPresented(next)
        // if (!next) {
        //   // optionally clear shop when sheet closes
        //   useShopStore.getState().setCurrentShop({} as TShop)
        // }
      }}
      license="commercial"
    >
      <Sheet.Portal>
        <Sheet.View className="BottomSheet-view" nativeEdgeSwipePrevention>
          <Sheet.Backdrop themeColorDimming="auto" />
          <Sheet.Content className="h-[90%] bg-neutral-50">
            <Sheet.Handle
              action="dismiss"
              className="block mx-auto focus:outline-none focus:ring-0 mt-2 mb-3 bg-gray-300"
            >
              Drag to expand
            </Sheet.Handle>

            <SearchBar onClose={props.foo} />
            {props.children}
            <Sheet.BleedingBackground className="BottomSheet-bleedingBackground" />
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  )
}
