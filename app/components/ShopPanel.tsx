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
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    setIsLargeScreen(mediaQuery.matches)

    const handleResize = () => setIsLargeScreen(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleResize)

    return () => mediaQuery.removeEventListener('change', handleResize)
  }, [])

  const currentShopIsEmpty = Object.keys(props.shop).length === 0

  const handlePanelClick = () => {
    console.log('touched', touched)
    setTouched(true)
  }

  const handleClose = () => {
    setTouched(false)
    props.emitClose()
  }

  return (
    <Transition.Root show={props.panelIsOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`w-full bottom-0  ${currentShopIsEmpty ? 'h-[calc(100%-64px)]' : 'h-1/3'}
              ${!!touched ? 'h-full' : 'h-1/3'}
              pointer-events-none fixed lg:w-fit lg:h-full lg:inset-y-0 lg:right-0 flex max-w-full lg:pl-10`}
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
                <Dialog.Panel className="pointer-events-auto w-screen lg:max-w-xl" onClick={handlePanelClick}>
                  {props.shop.properties ? (
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <PanelHeader shop={props.shop} emitClose={handleClose} />
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
