'use client'

import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'


export default function SearchBar() {
  const { searchValue, setSearchValue } = useShopsStore()
  const { panelMode } = usePanelStore()

  return (
    <div className="flex absolute shadow-md items-center px-2 bg-white top-8 lg:top-3 z-10 h-10 w-[90%] left-1/2 -translate-x-1/2 rounded-xl">
      <button type="button" aria-label="Back" onClick={() => usePanelStore.getState().back()}>
        {panelMode !== 'explore' && <ArrowLeftIcon className="size-4 mr-auto" />}
      </button>
      <input
        aria-label="Search for a shop or neighborhood"
        className="h-[24px] flex-1 bg-transparent border-none focus:outline-none focus:ring-0"
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        placeholder="Search for a shop or neighborhood"
      />
    </div>
  )
}
