'use client'
import { Fragment, useEffect, useState, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { TShop } from '@/types/shop-types'

interface IProps {
  children: any
  shop: TShop
  panelIsOpen: boolean
  emitClose: Function
  handlePanelContentClick: (shop: TShop) => void
}

export default function ShopPanel(props: IProps) {
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragHandleRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    setIsLargeScreen(mediaQuery.matches)
    const handleResize = () => setIsLargeScreen(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleResize)
    return () => mediaQuery.removeEventListener('change', handleResize)
  }, [])

  useEffect(() => {
    let touchStart = 0
    let scrollStart = 0
    let isHandleDrag = false

    const handleTouchStart = (event: TouchEvent) => {
      const target = event.target as HTMLElement
      const isDragHandle = dragHandleRef.current?.contains(target) || target.closest('.drag-handle-area')

      if (!isDragHandle && !isExpanded) return

      if (contentRef.current) {
        scrollStart = contentRef.current.scrollTop
        if (scrollStart > 0 && !isDragHandle) return
      }

      isHandleDrag = true
      touchStart = event.touches[0].clientY
      setIsDragging(true)
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!isHandleDrag) return

      const currentTouch = event.touches[0].clientY
      const delta = touchStart - currentTouch
      const windowHeight = window.innerHeight
      const threshold = windowHeight * 0.15

      if (Math.abs(delta) > 10) {
        event.preventDefault()
      }

      if (!isExpanded && delta > threshold) {
        setIsExpanded(true)
        isHandleDrag = false
      } else if (isExpanded && delta < -threshold) {
        setIsExpanded(false)
        isHandleDrag = false
      }
    }

    const handleTouchEnd = () => {
      isHandleDrag = false
      setIsDragging(false)
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isExpanded])

  return (
    <Transition.Root show={props.panelIsOpen} as={Fragment}>
      <Dialog data-testid="shop-panel" as="div" className="relative z-10" onClose={() => props.emitClose()}>
        <div className="fixed" />
        <div className="fixed overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div
              ref={panelRef}
              className={`
                pointer-events-auto fixed inset-x-0 bottom-0 w-full
                transition-[height] duration-300 ease-out
                ${isExpanded ? 'h-[100dvh]' : 'h-[50dvh]'}
                lg:w-fit lg:h-[calc(100%-4rem-3.5rem)] lg:inset-y-0 lg:top-16 lg:right-0 lg:pl-10
              `}
            >
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom={isLargeScreen ? 'translate-x-full' : 'translate-y-full'}
                enterTo={isLargeScreen ? 'translate-x-0' : 'translate-y-0'}
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom={isLargeScreen ? 'translate-x-0' : 'translate-y-0'}
                leaveTo={isLargeScreen ? 'translate-x-full' : 'translate-y-full'}
              >
                <Dialog.Panel className="h-full bg-neutral-50 overflow-hidden w-screen lg:max-w-xl flex flex-col">
                  <div
                    className="drag-handle-area h-8 cursor-grab active:cursor-grabbing flex-shrink-0"
                    ref={dragHandleRef}
                  >
                    <div className="h-1.5 w-12 bg-gray-300 rounded-full mx-auto my-3" />
                  </div>
                  <div
                    ref={contentRef}
                    className="flex-1 overflow-y-auto"
                    style={{
                      touchAction: isDragging ? 'none' : 'auto',
                    }}
                  >
                    {props.children}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
