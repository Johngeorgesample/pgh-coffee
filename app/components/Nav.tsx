'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [hamburgerIsOpen, setHamburgerIsOpen] = useState(false)

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
      <div className="hidden sm:flex items-center gap-4">
        <Link className="text-lg" href="/about">
          About
        </Link>
        <Link className="text-lg" href="/submit-a-shop">
          Submit a shop
        </Link>
        <Link className="text-lg" href="/settings">
          Settings
        </Link>
      </div>

      <div className="sm:hidden">
        <span className="text-4xl select-none" onClick={toggleHamburger}>
          {hamburgerIsOpen ? '×' : '☰'}
        </span>
      </div>

      <div
        className={`${hamburgerIsOpen ? 'z-20 absolute top-[4rem] left-0 h-[calc(100vh-7rem)] w-full bg-white sm:hidden' : 'hidden'}`}
      >
        <div className="flex flex-col items-center pt-8">
          <Link className="text-2xl" href="/about">
            About
          </Link>
          <Link className="text-2xl" href="/submit-a-shop">
            Submit a shop
          </Link>
          <Link className="text-2xl" href="/settings">
            Settings
          </Link>
        </div>
      </div>
    </nav>
  )
}
