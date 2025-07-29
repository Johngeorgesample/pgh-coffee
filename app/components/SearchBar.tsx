'use client'

import { useState } from 'react'
import { TShop } from '@/types/shop-types'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface IProps {
  value: string
  onClose: () => void
  shop: TShop
}

export default function SearchBar(props: IProps) {
  const [value, setValue] = useState(props.shop.properties.name)

  return (
    <div className="flex absolute shadow-md items-center px-2 bg-white top-2 z-10 h-10 w-[90%] left-1/2 -translate-x-1/2 rounded-xl">
      <input
        className="h-[24px] flex-1 bg-transparent border-none focus:outline-none focus:ring-0"
        value={value}
        onChange={e => setValue(e.target.value)}
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
