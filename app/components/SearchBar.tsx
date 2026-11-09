'use client'

import Link from 'next/link'
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { LocateFixed } from 'lucide-react'
import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'
import { NEAR_ME } from '@/hooks/useNearRouteSync'

export default function SearchBar() {
  const searchValue = useShopsStore(s => s.searchValue)
  const setSearchValue = useShopsStore(s => s.setSearchValue)
  const panelMode = usePanelStore(s => s.panelMode)
  const nearPoint = useShopsStore(s => s.nearPoint)
  const setNearPoint = useShopsStore(s => s.setNearPoint)

  const refitWhenAlreadyNearMe = (event: React.MouseEvent) => {
    if (!nearPoint || new URLSearchParams(window.location.search).get('near') !== NEAR_ME) return
    event.preventDefault()
    setNearPoint([...nearPoint])
  }

  return (
    <div className="flex absolute shadow-md items-center px-2 bg-white top-8 lg:top-3 z-10 h-10 w-[90%] left-1/2 -translate-x-1/2 rounded-xl">
      {panelMode !== 'explore' && (
        <button type="button" aria-label="Back" onClick={() => usePanelStore.getState().back()}>
          <ArrowLeftIcon className="size-4 mr-auto" />
        </button>
      )}
      <input
        aria-label="Search shops, roasters, or neighborhoods"
        className="h-[24px] min-w-0 flex-1 text-base bg-transparent border-none focus:outline-none focus:ring-0"
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        placeholder="Search shops, roasters, or neighborhoods"
      />
      {searchValue ? (
        <button
          type="button"
          aria-label="Clear search"
          className="flex size-10 shrink-0 items-center justify-center"
          onClick={() => setSearchValue('')}
        >
          <XMarkIcon className="size-5" />
        </button>
      ) : (
        <Link
          href={`/?near=${NEAR_ME}`}
          aria-label="Shops near me"
          title="Shops near me"
          onClick={refitWhenAlreadyNearMe}
          className="flex size-10 shrink-0 items-center justify-center text-gray-700 hover:text-amber-700"
        >
          <LocateFixed className="size-5" />
        </Link>
      )}
    </div>
  )
}
