'use client'

import { useAuth } from '@/app/components/AuthProvider'
import {
  LayoutDashboard,
  Heart,
  Settings,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '#dashboard', icon: LayoutDashboard },
  { name: 'Favorites', href: '#favorites', icon: Heart },
  { name: 'Settings', href: '#settings', icon: Settings },
]

interface SidebarProps {
  currentSection: string
  onSectionChange: (section: string) => void
}

export default function Sidebar({ currentSection, onSectionChange }: SidebarProps) {
  return (
    <div className="flex w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div className="flex items-center px-4 mb-6">
          <span className="ml-2 text-lg font-semibold text-gray-900">Account</span>
        </div>

        <nav className="flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = currentSection === item.name.toLowerCase()
            return (
              <button
                key={item.name}
                onClick={() => onSectionChange(item.name.toLowerCase())}
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
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
