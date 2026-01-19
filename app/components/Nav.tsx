'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusIcon, Settings, LogIn, User } from 'lucide-react'
import { useAuth } from '@/app/components/AuthProvider'

export default function Nav() {
  const [hamburgerIsOpen, setHamburgerIsOpen] = useState(false)
  const { user, loading } = useAuth()

  useEffect(() => {
    setHamburgerIsOpen(false)
  }, [])

  const toggleHamburger = () => {
    setHamburgerIsOpen(!hamburgerIsOpen)
  }

  return (
    <nav className="h-16 bg-yellow-300 flex items-center py-2 px-8 sm:gap-3">
      <span className="flex flex-1 justify-center sm:gap-3 sm:justify-start">
        <Link className="flex gap-1" href="/">
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
        <Link className="flex gap-1 items-center text-md hover:bg-black/5 p-2 hover:rounded-lg" href="/settings">
        <Settings className="w-4 h-4" />
          Settings
        </Link>
        <Link className="flex gap-1 items-center text-md rounded-2xl px-2 py-1 bg-black text-yellow-300 hover:bg-neutral-800" href="/submit-a-shop">
        <PlusIcon className="w-4 h-4" />
          Submit a shop
        </Link>
        {!loading &&
          (user ? (
            <Link href="/account" className="flex gap-1 items-center text-md hover:bg-black/5 p-2 hover:rounded-lg">
              <User className="w-4 h-4" />
              Account
            </Link>
          ) : (
            <Link href="/sign-in" className="flex gap-1 items-center text-md hover:bg-black/5 p-2 hover:rounded-lg">
              <LogIn className="w-4 h-4" />
              Sign in
            </Link>
          ))}
      </div>

      <div className="sm:hidden">
        <span className="text-4xl select-none" onClick={toggleHamburger}>
          {hamburgerIsOpen ? '×' : '☰'}
        </span>
      </div>

      <div
        className={`${hamburgerIsOpen ? 'z-20 absolute top-[4rem] left-0 h-[calc(100vh-7rem)] w-full bg-white sm:hidden' : 'hidden'}`}
      >
        <div className="flex flex-col items-center pt-8 gap-4">
          <Link className="text-2xl" href="/about" onClick={() => setHamburgerIsOpen(false)}>
            About
          </Link>
          <Link className="text-2xl" href="/submit-a-shop" onClick={() => setHamburgerIsOpen(false)}>
            Submit a shop
          </Link>
          <Link className="text-2xl" href="/settings" onClick={() => setHamburgerIsOpen(false)}>
            Settings
          </Link>
          {!loading &&
            (user ? (
              <Link className="text-2xl" href="/account" onClick={() => setHamburgerIsOpen(false)}>
                Account
              </Link>
            ) : (
              <Link className="text-2xl" href="/sign-in" onClick={() => setHamburgerIsOpen(false)}>
                Sign in
              </Link>
            ))}
        </div>
      </div>
    </nav>
  )
}
