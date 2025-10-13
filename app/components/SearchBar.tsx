'use client'

import useSearchStore from '@/stores/searchStore'
import { TShop } from '@/types/shop-types'
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface IProps {
  onClose?: () => void
  shop?: TShop
}

export default function SearchBar(props: IProps) {
  const { setSearchValue } = useSearchStore()
  return (
    <div className="flex absolute shadow-md items-center px-2 bg-white lg:top-5 z-10 h-10 w-[90%] rounded-xl left-1/2 -translate-x-1/2">
      <button onClick={() => {}}>{1 > 2 && <ArrowLeftIcon className="h-4 w-4 mr-auto" />}</button>
      <input
        className="h-[24px] flex-1 bg-transparent border-none focus:outline-none focus:ring-0"
        onChange={e => setSearchValue(e.target.value)}
        placeholder="Search for a shop or neighborhood"
      />
    </div>
  )
}
