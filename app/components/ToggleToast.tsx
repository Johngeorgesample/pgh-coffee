'use client'

import { useEffect } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import type { ToggleToastConfig } from './toggleConfigs'

interface ToggleToastProps {
  isOpen: boolean
  onClose: () => void
  shopName: string
  Icon: LucideIcon
  iconClassName: string
  config: ToggleToastConfig
}

export default function ToggleToast({ isOpen, onClose, shopName, Icon, iconClassName, config }: ToggleToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 5000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  return (
    <Transition show={isOpen}>
      <Dialog onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 pointer-events-none">
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
            <TransitionChild
              enter="transition ease-out duration-300"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
            >
              <DialogPanel className="bg-stone-900 text-white rounded-xl px-4 py-3 shadow-lg flex flex-col lg:flex-row items-center gap-3">
                <Icon className={`w-5 h-5 flex-shrink-0 ${iconClassName}`} />
                <p className="text-sm">
                  <span className="font-medium">{shopName}</span> {config.verbPhrase}
                </p>
                <Link
                  href={config.viewHref}
                  onClick={onClose}
                  className="ml-2 text-sm font-medium text-yellow-300 hover:text-yellow-200 whitespace-nowrap"
                >
                  {config.viewLabel}
                </Link>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
