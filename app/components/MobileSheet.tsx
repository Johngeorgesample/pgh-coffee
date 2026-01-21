'use client'

import { useEffect, RefObject } from 'react'
import { Sheet } from '@silk-hq/components'
import SearchBar from './SearchBar'

interface MobileSheetProps {
  children?: React.ReactNode
  presented: boolean
  onPresentedChange: (presented: boolean) => void
  activeDetent: number | undefined
  onActiveDetentChange: (detent: number | undefined) => void
  detents: readonly string[]
  contentRef: RefObject<HTMLDivElement | null>
  middleDetentIndex: number
  lastDetentIndex: number
  isTouch: boolean
}

export default function MobileSheet({
  children,
  presented,
  onPresentedChange,
  activeDetent,
  onActiveDetentChange,
  detents,
  contentRef,
  middleDetentIndex,
  lastDetentIndex,
  isTouch,
}: MobileSheetProps) {
  // Touch-only: if user scrolls DOWN while on middle detent, expand to full
  useEffect(() => {
    if (!isTouch) return
    const el = contentRef.current
    if (!el) return

    let touchStartY: number | null = null

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? null
    }

    const onTouchMove = (e: TouchEvent) => {
      if (activeDetent !== middleDetentIndex) return
      const startY = touchStartY
      const currY = e.touches[0]?.clientY
      if (startY == null || currY == null) return

      const deltaY = currY - startY
      if (deltaY < -6) {
        e.preventDefault()
        onActiveDetentChange(lastDetentIndex)
      }
    }

    const onTouchEnd = () => {
      touchStartY = null
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('touchcancel', onTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', onTouchStart as any)
      el.removeEventListener('touchmove', onTouchMove as any)
      el.removeEventListener('touchend', onTouchEnd as any)
      el.removeEventListener('touchcancel', onTouchEnd as any)
    }
  }, [isTouch, activeDetent, middleDetentIndex, lastDetentIndex, contentRef, onActiveDetentChange])

  return (
    <Sheet.Root
      presented={presented}
      onPresentedChange={onPresentedChange}
      activeDetent={activeDetent}
      onActiveDetentChange={onActiveDetentChange}
      license="commercial"
    >
      <Sheet.Portal>
        <Sheet.View
          className="BottomSheet-view"
          detents={detents as unknown as string[]}
          nativeEdgeSwipePrevention
        >
          <Sheet.Backdrop themeColorDimming="auto" />
          <Sheet.Content ref={contentRef} className="h-[90%] bg-neutral-50 overflow-y-auto">
            <Sheet.Handle
              action="dismiss"
              className="block mx-auto focus:outline-none focus:ring-0 mt-2 mb-3 bg-gray-300"
            >
              Drag to expand
            </Sheet.Handle>

            <SearchBar />
            {children}

            <Sheet.BleedingBackground className="BottomSheet-bleedingBackground" />
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  )
}
