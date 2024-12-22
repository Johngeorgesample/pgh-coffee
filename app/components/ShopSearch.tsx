import { useEffect, useState, useRef } from 'react'
import { usePlausible } from 'next-plausible'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { TShop } from '@/types/shop-types'
import useShopsStore from '@/stores/coffeeShopsStore'
import ShopList from '@/app/components/ShopList'

interface IProps {
  handleResultClick: (shop: TShop) => void
}

export default function ShopSearch(props: IProps) {
  const { coffeeShops } = useShopsStore()
  const plausible = usePlausible()
  const inputRef = useRef<HTMLInputElement>(null)
  let [filter, setFilter] = useState('')

  const handleFilterClear = () => {
    setFilter('')
  }

  const handleCardClick = (shop: TShop) => {
    props.handleResultClick(shop)
    setFilter('')
    plausible('ShopSearchClick', {
      props: {
        shopName: shop.properties.name,
        neighborhood: shop.properties.neighborhood,
      },
    })
  }

  useEffect(() => {
    inputRef?.current?.focus()
  }, [])

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 sm:px-6">
      <div className="flex justify-center flex-col mt-4">
        <div className="my-2 border rounded-lg px-2 w-full flex items-center gap-2">
          <span className="inline text-gray-500" aria-hidden="true">
            <MagnifyingGlassIcon className="h-4 w-4" />
          </span>
          <input
            ref={inputRef}
            className="inline flex-1 outline-none border-none h-6 active:outline text-gray-500 bg-transparent"
            onChange={e => setFilter(e.target.value)}
            placeholder="Search for a shop or neighborhood"
            value={filter}
          />
          {filter && (
            <button className="inline ml-2 text-gray-500 hover:text-gray-600" onClick={handleFilterClear}>
              ×
            </button>
          )}
        </div>
      </div>

      <ShopList coffeeShops={coffeeShops.features} filter={filter} handleCardClick={handleCardClick} />
    </div>
  )
}
