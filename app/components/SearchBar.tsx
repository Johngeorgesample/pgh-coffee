'use client'

import { TShop } from '@/types/shop-types'
import { XMarkIcon } from '@heroicons/react/24/outline'
import useShopsStore from '@/stores/coffeeShopsStore'

interface IProps {
  onClose: () => void
  shop?: TShop
}

export default function SearchBar(props: IProps) {
  const { searchValue, setSearchValue } = useShopsStore()

  return (
    <div className="flex absolute shadow-md items-center px-2 bg-white top-2 z-10 h-10 w-[90%] left-1/2 -translate-x-1/2 rounded-xl">
      <input
        className="h-[24px] flex-1 bg-transparent border-none focus:outline-none focus:ring-0"
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        placeholder="Search for a shop or neighborhood"
      />
      <button
        onClick={() => {
          props.onClose()
        }}
      >
        <XMarkIcon className="h-6 w-6 ml-auto" />
      </button>
    </div>
  )
}
