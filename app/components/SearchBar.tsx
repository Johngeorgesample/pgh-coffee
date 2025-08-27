'use client'

import { TShop } from '@/types/shop-types'
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import usePanelStore from '@/stores/panelStore'

interface IProps {
  onClose: () => void
  shop?: TShop
}

export default function SearchBar(props: IProps) {
  const { searchValue, setSearchValue, panelMode } = usePanelStore()

  return (
    <div className="flex absolute shadow-md items-center px-2 bg-white top-5 lg:top-3 z-10 h-10 w-[90%] left-1/2 -translate-x-1/2 rounded-xl">
      <button onClick={() => usePanelStore.getState().back()}>
        {panelMode !== 'explore' && <ArrowLeftIcon className="h-4 w-4 mr-auto" />}
      </button>
      <input
        className="h-[24px] flex-1 bg-transparent border-none focus:outline-none focus:ring-0"
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        placeholder="Search for a shop or neighborhood"
      />
      {panelMode !== 'explore' && (
        <button
          onClick={() => {
            props.onClose()
          }}
        >
          <XMarkIcon className="h-6 w-6 ml-auto" />
        </button>
      )}
    </div>
  )
}
