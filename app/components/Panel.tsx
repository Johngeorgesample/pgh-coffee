
'use client'

import { useEffect, useRef, useState } from 'react'
import { Sheet } from '@silk-hq/components'
import { TShop } from '@/types/shop-types'
import useShopStore from '@/stores/coffeeShopsStore'
import SearchBar from './SearchBar'
import { useMediaQuery } from '@/hooks'

interface IProps {
  children?: React.ReactNode
  shop: TShop
  foo: any
}

export default function Panel(props: IProps) {
  const currentShop = useShopStore(s => s.currentShop)
  const [presented, setPresented] = useState(false)

  // detents: middle (60vh) -> full
  const detents = ['60vh'] as const
  const lastDetentIndex = detents.length + 1 // 2
  const middleDetentIndex = lastDetentIndex - 1 // 1
  const [activeDetent, setActiveDetent] = useState<number | undefined>()

  const contentRef = useRef<HTMLDivElement | null>(null)
  const touchStartY = useRef<number | null>(null)
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
    setPresented(Boolean(currentShop && Object.keys(currentShop).length))
  }, [currentShop])

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

  // Touch-only: if user scrolls DOWN while on middle detent, expand to full
  useEffect(() => {
    if (!isTouch) return
    const el = contentRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0]?.clientY ?? null
    }

    const onTouchMove = (e: TouchEvent) => {
      if (activeDetent !== middleDetentIndex) return
      const startY = touchStartY.current
      const currY = e.touches[0]?.clientY
      if (startY == null || currY == null) return

      const deltaY = currY - startY
      // Finger moves UP (deltaY < 0) => content would scroll DOWN.
      // Trigger expand only on that gesture, with a tiny threshold to avoid noise.
      if (deltaY < -6) {
        e.preventDefault() // stop the partial scroll
        setActiveDetent(lastDetentIndex)
      }
      // If deltaY >= 0 (pulling down), do nothing (allow normal behavior)
    }

    const onTouchEnd = () => {
      touchStartY.current = null
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false }) // must be non-passive to preventDefault
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('touchcancel', onTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', onTouchStart as any)
      el.removeEventListener('touchmove', onTouchMove as any)
      el.removeEventListener('touchend', onTouchEnd as any)
      el.removeEventListener('touchcancel', onTouchEnd as any)
    }
  }, [isTouch, activeDetent, middleDetentIndex, lastDetentIndex])

  if (largeViewport) {
    return (
      <div data-testid="shop-panel" className="relative z-10">
        <div className="fixed overflow-hidden">
          <div className="absolute overflow-hidden">
            <div className="w-full bottom-0 h-full pointer-events-none fixed lg:w-1/3 lg:h-[calc(100%-4rem)] lg:inset-y-0 lg:top-16 lg:right-0 flex max-w-full">
              <div ref={contentRef} className="bg-neutral-50 overflow-y-auto pointer-events-auto w-screen lg:max-w-4xl">
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

            {props.children}

            <Sheet.BleedingBackground className="BottomSheet-bleedingBackground" />
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  )
}
