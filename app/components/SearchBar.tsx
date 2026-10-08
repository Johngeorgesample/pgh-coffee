'use client'

import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'


export default function SearchBar() {
  const searchValue = useShopsStore(s => s.searchValue)
  const setSearchValue = useShopsStore(s => s.setSearchValue)
  const panelMode = usePanelStore(s => s.panelMode)

  return (
    <div className="flex absolute shadow-md items-center px-2 bg-white top-8 lg:top-3 z-10 h-10 w-[90%] left-1/2 -translate-x-1/2 rounded-xl">
      {panelMode !== 'explore' && (
        <button type="button" aria-label="Back" onClick={() => usePanelStore.getState().back()}>
          <ArrowLeftIcon className="size-4 mr-auto" />
        </button>
      )}
      <input
        aria-label="Search for a shop or neighborhood"
        className="h-[24px] min-w-0 flex-1 text-base bg-transparent border-none focus:outline-none focus:ring-0"
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        placeholder="Search for a shop or neighborhood"
      />
      {searchValue && (
        <button type="button" aria-label="Clear search" className="flex size-10 shrink-0 items-center justify-center" onClick={() => setSearchValue('')}>
          <XMarkIcon className="size-5" />
        </button>
      )}
    </div>
  )
}
