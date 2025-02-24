'use client'

import { Fragment, useEffect, useState } from 'react'
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

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    setIsLargeScreen(mediaQuery.matches)

    const handleResize = () => setIsLargeScreen(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleResize)

    return () => mediaQuery.removeEventListener('change', handleResize)
  }, [])

  return (
    <Transition show={props.panelIsOpen}>
      <Dialog data-testid="shop-panel" as="div" className="relative z-10" onClose={() => props.emitClose()}>
        <div className="fixed" />
        <div className="fixed overflow-hidden">
          <div className="absolute overflow-hidden">
            <div className="w-full bottom-0 h-1/2 pointer-events-none fixed lg:w-fit lg:h-[calc(100%-4rem-3.5rem)] lg:inset-y-0 lg:top-16 lg:right-0 flex max-w-full lg:pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom={isLargeScreen ? 'translate-x-full' : 'translate-y-full'}
                enterTo={isLargeScreen ? 'translate-x-0' : 'translate-y-0'}
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom={isLargeScreen ? 'translate-x-0' : 'translate-y-0'}
                leaveTo={isLargeScreen ? 'translate-x-full' : 'translate-y-full'}
              >
                <div className="bg-neutral-50 overflow-y-auto pointer-events-auto w-screen lg:max-w-xl">
                  {props.children}
                </div>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
