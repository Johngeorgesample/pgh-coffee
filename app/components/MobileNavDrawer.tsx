'use client'

import { Sheet } from '@silk-hq/components'
import Link from 'next/link'
import { Info, User, ChevronRight, Plus } from 'lucide-react'
import { useAuth } from '@/app/components/AuthProvider'

interface IProps {
  presented: boolean
  onPresentedChange: (presented: boolean) => void
}

export default function MobileNavDrawer({ presented, onPresentedChange }: IProps) {
  const { user, loading } = useAuth()

  const handleLinkClick = () => {
    onPresentedChange(false)
  }

  return (
    <Sheet.Root
      presented={presented}
      onPresentedChange={onPresentedChange}
      license="commercial"
    >
      <Sheet.Portal>
        <Sheet.View
          className="MobileNavDrawer-view z-50"
          nativeEdgeSwipePrevention
        >
          <Sheet.Backdrop className="z-50" themeColorDimming="auto" />
          <Sheet.Content className="z-50 bg-white rounded-t-2xl">
            <Sheet.Handle className="block mx-auto focus:outline-none focus:ring-0 mt-3 mb-2 w-10 h-1 rounded-full bg-gray-300" />

            <div className="px-6 pb-6 pt-2">
              {/* Navigation Links */}
              <nav className="flex flex-col">
                <Link
                  href="/about"
                  onClick={handleLinkClick}
                  className="flex items-center py-4 border-b border-gray-100"
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                    <Info className="w-5 h-5 text-gray-600" />
                  </span>
                  <span className="flex-1 ml-4 text-base font-medium text-gray-900">About</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>

                {!loading && (
                  user ? (
                    <Link
                      href="/account"
                      onClick={handleLinkClick}
                      className="flex items-center py-4 border-b border-gray-100"
                    >
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                        <User className="w-5 h-5 text-gray-600" />
                      </span>
                      <span className="flex-1 ml-4 text-base font-medium text-gray-900">Account</span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>
                  ) : (
                    <Link
                      href="/sign-in"
                      onClick={handleLinkClick}
                      className="flex items-center py-4 border-b border-gray-100"
                    >
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                        <User className="w-5 h-5 text-gray-600" />
                      </span>
                      <span className="flex-1 ml-4 text-base font-medium text-gray-900">Sign in</span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>
                  )
                )}
              </nav>

              {/* Submit a shop button */}
              <Link
                href="/submit-a-shop"
                onClick={handleLinkClick}
                className="flex items-center justify-center gap-2 mt-6 py-4 bg-yellow-300 rounded-xl font-medium text-black hover:bg-yellow-400 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Submit a shop
              </Link>
            </div>

            <Sheet.BleedingBackground className="bg-white" />
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  )
}
