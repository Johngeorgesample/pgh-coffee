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
          <img src="/logo_without_name.jpeg" width="36" height="36" alt="pgh.coffee logo" />
          <p className="flex items-center text-2xl">pgh.coffee</p>
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
          className="flex gap-1 items-center text-md rounded-2xl px-2 py-1 bg-gray-950 text-yellow-300 hover:bg-neutral-800"
          href="/submit-a-shop"
        >
          <PlusIcon className="size-4" />
          Submit a shop
        </Link>
      </div>

      <button
        type="button"
        className="sm:hidden p-2 -mr-2"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="size-6" />
      </button>

      <MobileNavDrawer
        presented={drawerOpen}
        onPresentedChange={setDrawerOpen}
      />
    </nav>
  )
}
