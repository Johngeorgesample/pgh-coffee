'use client'

import { TShop } from '@/types/shop-types'
import SearchBar from './SearchBar'

interface IProps {
  children: any
  shop: TShop
  foo: any
}

export default function Panel(props: IProps) {
  return (
    <div data-testid="shop-panel" className="relative z-10">
      <div className="fixed overflow-hidden">
        <div className="absolute overflow-hidden">
          <div className="w-full bottom-0 h-1/2 pointer-events-none fixed lg:w-1/3 lg:h-[calc(100%-4rem-3.5rem)] lg:inset-y-0 lg:top-16 lg:right-0 flex max-w-full">
            <div className="bg-neutral-50 overflow-y-auto pointer-events-auto w-screen lg:max-w-xl">
              <SearchBar onClose={props.foo} />
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
