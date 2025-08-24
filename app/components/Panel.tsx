'use client'

import { useState, useEffect } from 'react'
import { Sheet } from '@silk-hq/components'
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

  useEffect(() => {
    if (currentShop) {
      setPresented(true)
    } else {
      setPresented(false)
    }
  }, [currentShop])

  return (
    <Sheet.Root
      presented={presented}
      onPresentedChange={next => {
        setPresented(next)
        if (!next) {
          // optionally clear shop when sheet closes
          useShopStore.getState().setCurrentShop({} as TShop)
        }
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
