'use client'

import { Sheet } from '@silk-hq/components'
import { TShop } from '@/types/shop-types'
import SearchBar from './SearchBar'

interface IProps {
  children: any
  shop: TShop
  foo: any
}

export default function Panel(props: IProps) {
  return (
    <Sheet.Root defaultPresented license="commercial">
      <Sheet.Portal>
        <Sheet.View
          className="BottomSheet-view"
          nativeEdgeSwipePrevention
        >
          <Sheet.Backdrop themeColorDimming="auto" />
          <Sheet.Content className="h-[90%] bg-neutral-50">
            {/* cycles content -> full-height -> content ... */}
            <Sheet.Handle action="dismiss" className="bg-gray-300">Drag to expand</Sheet.Handle>

            <SearchBar onClose={props.foo} />
            {props.children}
            <Sheet.BleedingBackground className="BottomSheet-bleedingBackground" />
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  )
}
