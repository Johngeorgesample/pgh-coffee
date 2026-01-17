'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { TShop } from '@/types/shop-types'
import useShopStore from '@/stores/coffeeShopsStore'
import SearchBar from './SearchBar'
import { useMediaQuery } from '@/hooks'

const MobileSheet = dynamic(() => import('./MobileSheet'), {
  ssr: false,
  loading: () => <div className="fixed inset-x-0 bottom-0 h-[60vh] bg-neutral-50 rounded-t-xl" />,
})

interface IProps {
  children?: React.ReactNode
  shop: TShop
  presented?: boolean
  onPresentedChange?: (presented: boolean) => void
}

export default function Panel(props: IProps) {
  const currentShop = useShopStore(s => s.currentShop)
  const [internalPresented, setInternalPresented] = useState(true)

  const presented = props.presented !== undefined ? props.presented : internalPresented
  const setPresented = props.onPresentedChange || setInternalPresented

  // detents: middle (60vh) -> full
  const detents = ['60vh'] as const
  const lastDetentIndex = detents.length + 1 // 2
  const middleDetentIndex = lastDetentIndex - 1 // 1
  const [activeDetent, setActiveDetent] = useState<number | undefined>()

  const contentRef = useRef<HTMLDivElement | null>(null)
  const largeViewport = useMediaQuery('(min-width: 1024px)')

  // detect touch device once
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    const touch =
      (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) ||
      (typeof window !== 'undefined' &&
        window.matchMedia?.('(pointer: coarse)').matches)
    setIsTouch(Boolean(touch))
  }, [])

  useEffect(() => {
    if (presented && currentShop && Object.keys(currentShop).length > 0) {
        if (largeViewport && contentRef.current) {
          contentRef.current.scrollTop = 0
        } else {
          const scrollableContainer = document.querySelector('.flex.h-full.flex-col.overflow-y-auto')
          if (scrollableContainer) {
            scrollableContainer.scrollTop = 0
          }
        }
    }
  }, [presented, currentShop, largeViewport])

  if (largeViewport) {
    return (
      <div data-testid="shop-panel" className="relative z-10">
        <div className="fixed overflow-hidden">
          <div className="absolute overflow-hidden">
            <div className="w-full bottom-0 h-full pointer-events-none fixed lg:w-1/3 lg:h-[calc(100%-4rem)] lg:inset-y-0 lg:top-16 lg:right-0 flex max-w-full">
              <div ref={contentRef} className="bg-neutral-50 overflow-y-auto pointer-events-auto w-screen lg:max-w-4xl">
                <SearchBar />
                {props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <MobileSheet
      presented={presented}
      onPresentedChange={setPresented}
      activeDetent={activeDetent}
      onActiveDetentChange={setActiveDetent}
      detents={detents}
      contentRef={contentRef}
      middleDetentIndex={middleDetentIndex}
      lastDetentIndex={lastDetentIndex}
      isTouch={isTouch}
    >
      {props.children}
    </MobileSheet>
  )
}
