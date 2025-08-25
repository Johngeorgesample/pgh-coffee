'use client'

import { useEffect, useRef, useState } from 'react'
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

  // two detents: 60vh and full screen
  const detents = ['60vh'] as const
  const lastDetentIndex = detents.length + 1 // 2 detents -> last = 2
  const middleDetentIndex = lastDetentIndex - 1
  const [activeDetent, setActiveDetent] = useState<number | undefined>()

  const isMax = (activeDetent ?? 1) === lastDetentIndex

  const contentRef = useRef<HTMLDivElement | null>(null)
  const largeViewport = useClientMediaQuery('(min-width: 1024px)')

  // follow currentShop
  useEffect(() => {
    setPresented(Boolean(currentShop && Object.keys(currentShop).length))
  }, [currentShop])

  // expand to max if user scrolls on middle detent
  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const expandToMax = () => {
      if (activeDetent === middleDetentIndex) {
        setActiveDetent(lastDetentIndex)
      }
    }

    const onWheel = (e: WheelEvent) => {
      if (activeDetent === middleDetentIndex) {
        e.preventDefault()
        expandToMax()
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (activeDetent === middleDetentIndex) {
        e.preventDefault()
        expandToMax()
      }
    }

    const onScroll = () => {
      if (activeDetent === middleDetentIndex && el.scrollTop > 0) {
        el.scrollTop = 0
        expandToMax()
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      el.removeEventListener('wheel', onWheel as any)
      el.removeEventListener('touchmove', onTouchMove as any)
      el.removeEventListener('scroll', onScroll as any)
    }
  }, [activeDetent, middleDetentIndex, lastDetentIndex])

  if (largeViewport) {
    return (
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
    )
  }

  return (
    <Sheet.Root
      presented={presented}
      onPresentedChange={setPresented}
      activeDetent={activeDetent}
      onActiveDetentChange={setActiveDetent}
      license="commercial"
    >
      <Sheet.Portal>
        <Sheet.View
          className="BottomSheet-view"
          detents={detents as unknown as string[]}
          nativeEdgeSwipePrevention
        >
          <Sheet.Backdrop themeColorDimming="auto" />
          <Sheet.Content ref={contentRef} className="h-[90%] bg-neutral-50">
            <Sheet.Handle
              action="dismiss"
              className="block mx-auto focus:outline-none focus:ring-0 mt-2 mb-3 bg-gray-300"
            >
              Drag to expand
            </Sheet.Handle>

            {!isMax && <SearchBar onClose={props.foo} />}
            {props.children}

            <Sheet.BleedingBackground className="BottomSheet-bleedingBackground" />
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  )
}
