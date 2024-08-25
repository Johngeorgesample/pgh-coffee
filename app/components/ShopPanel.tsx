'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { TShop } from '@/types/shop-types'
import PanelHeader from './PanelHeader'
import PanelContent from './PanelContent'
import PanelFooter from './PanelFooter'

interface IProps {
  shop: TShop
  panelIsOpen: boolean
  emitClose: Function
  foobar: any
}

export default function ShopPanel(props: IProps) {
  return (
    <Transition.Root show={props.panelIsOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => props.emitClose()}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <PanelHeader shop={props.shop} emitClose={props.emitClose} />
                    <PanelContent bar={props.foobar} shop={props.shop} />
                    <PanelFooter shop={props.shop} />
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
