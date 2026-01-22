'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Heart,
  Settings,
  Menu,
  X,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/account', icon: LayoutDashboard },
  { name: 'Favorites', href: '/account/favorites', icon: Heart },
  { name: 'Settings', href: '/account/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {navigation.map((item) => {
        const isActive =
          item.href === '/account'
            ? pathname === '/account'
            : pathname.startsWith(item.href)
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onClick}
            className={`group flex w-full items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium ${
              isActive
                ? 'bg-yellow-50 text-yellow-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon
              className={`h-5 w-5 flex-shrink-0 ${
                isActive ? 'text-yellow-600' : 'text-gray-400 group-hover:text-gray-500'
              }`}
            />
            {item.name}
          </Link>
        )
      })}
    </>
  )

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-900">Account</span>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-2 py-2">
          <nav className="space-y-1">
            <NavLinks onClick={() => setMobileMenuOpen(false)} />
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex items-center px-4 mb-6">
            <span className="ml-2 text-lg font-semibold text-gray-900">Account</span>
          </div>

          <nav className="flex-1 space-y-1 px-2">
            <NavLinks />
          </nav>
        </div>
      </div>
    </>
  )
}
