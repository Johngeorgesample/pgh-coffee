'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { PlusIcon, Menu } from 'lucide-react'
import { useAuth } from '@/app/components/AuthProvider'
import usePanelStore from '@/stores/panelStore'
import { ExploreContent } from './ExploreContent'
import MobileNavDrawer from './MobileNavDrawer'

export default function Nav() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user, loading } = useAuth()
  const { reset } = usePanelStore()

  const handleLogoClick = () => {
    reset({ mode: 'explore', content: <ExploreContent /> })
  }

  return (
    <nav className="h-16 bg-yellow-300 flex items-center py-2 px-8 sm:gap-3">
      <span className="flex flex-1 justify-center sm:gap-3 sm:justify-start">
        <Link className="flex gap-1" href="/" onClick={handleLogoClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 250 250">
            <path
              fill="#000000"
              stroke="none"
              d="M34.94,10.53 l21.81,48.63 h-51.62 l60.37,180.31 h119 l60.37,-180.31 h-51.62 l21.81,-48.63 z"
            />
          </svg>
          <h1 className="flex items-center text-2xl">pgh.coffee</h1>
        </Link>
      </span>
      <div className="hidden sm:flex items-center gap-6">
        <Link className="flex gap-1 text-md hover:bg-black/5 p-2 hover:rounded-lg" href="/about">
          About
        </Link>
        {!loading &&
          (user ? (
            <Link href="/account" className="flex gap-1 items-center text-md hover:bg-black/5 p-2 hover:rounded-lg">
              Account
            </Link>
          ) : (
            <Link href="/sign-in" className="flex gap-1 items-center text-md hover:bg-black/5 p-2 hover:rounded-lg">
              Sign in
            </Link>
          ))}
        <Link
          className="flex gap-1 items-center text-md rounded-2xl px-2 py-1 bg-black text-yellow-300 hover:bg-neutral-800"
          href="/submit-a-shop"
        >
          <PlusIcon className="w-4 h-4" />
          Submit a shop
        </Link>
      </div>

      <button
        className="sm:hidden p-2 -mr-2"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <MobileNavDrawer
        presented={drawerOpen}
        onPresentedChange={setDrawerOpen}
      />
    </nav>
  )
}
