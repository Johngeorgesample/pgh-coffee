'use client'

import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { TShop } from '@/types/shop-types'
import PanelHeader from './PanelHeader'
import PanelContent from './PanelContent'
import PanelFooter from './PanelFooter'
import ShopSearch from './ShopSearch'

interface IProps {
  shop: TShop
  panelIsOpen: boolean
  emitClose: Function
  handlePanelContentClick: (shop: TShop) => void
}

export default function ShopPanel(props: IProps) {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    setIsLargeScreen(mediaQuery.matches)

    const handleResize = () => setIsLargeScreen(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleResize)

    return () => mediaQuery.removeEventListener('change', handleResize)
  }, [])

  return (
    <Transition.Root show={props.panelIsOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => props.emitClose()}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="w-full bottom-0 h-1/2 pointer-events-none fixed lg:w-fit lg:h-full lg:inset-y-0 lg:right-0 flex max-w-full lg:pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom={isLargeScreen ? 'translate-x-full' : 'translate-y-full'}
                enterTo={isLargeScreen ? 'translate-x-0' : 'translate-y-0'}
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom={isLargeScreen ? 'translate-x-0' : 'translate-y-0'}
                leaveTo={isLargeScreen ? 'translate-x-full' : 'translate-y-full'}
              >
                <Dialog.Panel className="pointer-events-auto w-screen lg:max-w-xl">
                  {props.shop.properties ? (
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <PanelHeader shop={props.shop} emitClose={props.emitClose} />
                      <PanelContent handleNearbyShopClick={props.handlePanelContentClick} shop={props.shop} />
                      <PanelFooter shop={props.shop} />
                    </div>
                  ) : (
                    <ShopSearch handleResultClick={props.handlePanelContentClick} />
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
