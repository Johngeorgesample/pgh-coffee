'use client'

import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { TShop } from '@/types/shop-types'
import { useSpring, animated as a } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'

interface IProps {
  children: any
  shop: TShop
  panelIsOpen: boolean
  emitClose: Function
  handlePanelContentClick: (shop: TShop) => void
}

export default function ShopPanel(props: IProps) {
  const [isLargeScreen, setIsLargeScreen] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    setIsLargeScreen(mediaQuery.matches)

    const handleResize = () => setIsLargeScreen(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleResize)

    return () => mediaQuery.removeEventListener('change', handleResize)
  }, [])

  const [{ y }, api] = useSpring(() => ({ y: 0 }))

  const bind = useDrag(
    ({ last, movement: [, my], cancel, velocity, direction: [, dy] }) => {
      if (my < 0) return // prevent swipe *up*

      if (last) {
        if (my > 100 || (velocity > 0.5 && dy > 0)) {
          api.start({ y: 1000, immediate: false })
          setTimeout(() => props.emitClose(), 200)
        } else {
          api.start({ y: 0, immediate: false })
        }
      } else {
        api.start({ y: my, immediate: true })
      }
    },
    { filterTaps: true, axis: 'y' },
  )

  if (!props.panelIsOpen) return null

  return (
    <Dialog
      open={props.panelIsOpen}
      onClose={() => props.emitClose()}
      data-testid="shop-panel"
      as="div"
      className="relative z-10"
    >
      <div className="fixed" />
      <div className="fixed overflow-hidden">
        <div className="absolute overflow-hidden">
          {isLargeScreen ? (
            <div className="w-full bottom-0 h-1/2 pointer-events-none fixed lg:w-fit lg:h-[calc(100%-4rem-3.5rem)] lg:inset-y-0 lg:top-16 lg:right-0 flex max-w-full lg:pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="bg-neutral-50 overflow-y-auto pointer-events-auto w-screen lg:max-w-xl">
                  {props.children}
                </div>
              </Transition.Child>
            </div>
          ) : (
            <div className="w-full bottom-0 h-[90%] pointer-events-none fixed flex">
              <a.div
                {...bind()}
                style={{ y }}
                className="bg-neutral-50 overflow-y-auto pointer-events-auto w-screen rounded-t-lg touch-none"
              >
                {props.children}
              </a.div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  )
}
