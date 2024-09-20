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
        <a className="flex gap-1" href="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 250 250">
            <path
              fill="#000000"
              stroke="none"
              d="M34.94,10.53 l21.81,48.63 h-51.62 l60.37,180.31 h119 l60.37,-180.31 h-51.62 l21.81,-48.63 z"
            />
          </svg>
          <h1 className="flex items-center text-2xl">pgh.coffee</h1>
        </a>
      </span>
      <div className="hidden sm:flex items-center gap-4">
        <a className="flex items-center gap-2" href="https://github.com/Johngeorgesample/pgh-coffee" target="_blank">
          <svg width="24" height="24" viewBox="0 0 97.707 97.707" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
              fill="#000"
            />
          </svg>
          <span className="text-lg">GitHub</span>
        </a>
        <a className="text-lg" href="/about">
          About
        </a>
          <a className="text-lg" href="/submit-a-shop">
            Submit a shop
          </a>
        <a className="text-lg" href="/settings">
          Settings
        </a>
      </div>

      <div className="sm:hidden">
        <span className="text-4xl select-none" onClick={toggleHamburger}>
          {hamburgerIsOpen ? '×' : '☰'}
        </span>
      </div>

      <div
        className={`${hamburgerIsOpen ? 'z-10 absolute top-[4rem] left-0 h-[calc(100vh-7rem)] w-full bg-white sm:hidden' : 'hidden'}`}
      >
        <div className="flex flex-col items-center pt-8">
          <a className="text-2xl" href="https://github.com/Johngeorgesample/pgh-coffee">
            GitHub
          </a>
          <a className="text-2xl" href="/about">
            About
          </a>
          <a className="text-2xl" href="/submit-a-shop">
            Submit a shop
          </a>
          <a className="text-2xl" href="/settings">
            Settings
          </a>
        </div>
      </div>
    </nav>
  )
}
