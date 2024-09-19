import { useEffect, useState, useRef } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { TShop } from '@/types/shop-types'
import useShopsStore from '@/stores/coffeeShopsStore'

interface IProps {
  handleResultClick: (shop: TShop) => void
}

export default function ShopSearch(props: IProps) {
  const { coffeeShops } = useShopsStore()
  const inputRef = useRef<HTMLInputElement>(null)
  let [filter, setFilter] = useState('')

  const meetsFilterCriteria = (shop: any) => {
    if (filter) {
      const shopCardText = `${shop.properties.neighborhood.toLowerCase()} ${shop.properties.name.toLowerCase()}`
      return shopCardText.includes(filter.toLowerCase())
    }
  }

  const handleFilterClear = () => {
    setFilter('')
  }

  const handleCardClick = (shop: TShop) => {
    props.handleResultClick(shop)
    setFilter('')
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLLIElement>, shop: TShop) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCardClick(shop)
    }
  }

  useEffect(() => {
    inputRef?.current?.focus()
  }, [])

  return (
    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
      <div className="flex justify-center flex-col mt-4 mx-4 sm:mx-6 ">
        <div className="my-2 border rounded-lg px-2 w-full flex items-center gap-2">
          <span className="inline text-gray-500" aria-hidden="true">
            <MagnifyingGlassIcon className="h-4 w-4" />
          </span>
          <input
            ref={inputRef}
            className="inline flex-1 outline-none border-none h-6 active:outline text-gray-500 bg-transparent"
            onChange={e => setFilter(e.target.value)}
            placeholder="Search for a shop"
            value={filter}
          />
          {filter && (
            <button className="inline ml-2 text-gray-500 hover:text-gray-600" onClick={handleFilterClear}>
              ×
            </button>
          )}
        </div>
      </div>

      <ul className="relative mt-6 flex-1 px-4 sm:px-6">
        {coffeeShops.features.map((shop: any) => {
          if (meetsFilterCriteria(shop) || !filter) {
            return (
              <li
                key={shop.properties.name + shop.properties.address}
                className="relative mb-4 rounded overflow-hidden shadow-md hover:cursor-pointer"
                onClick={() => handleCardClick(shop)}
                onKeyPress={(event) => handleKeyPress(event, shop)}
                tabIndex={0}
                role="button"
              >
                <div
                  className="h-36 relative bg-yellow-200 bg-cover bg-center"
                  style={shop.properties.photo ? { backgroundImage: `url('${shop.properties.photo}')` } : {}}
                />
                <div className="px-6 py-2">
                  <p className="font-medium text-xl text-left block">{shop.properties.name}</p>
                  <p className="w-fit mb-1 text-left text-gray-700 border border-transparent">
                    {shop.properties.neighborhood}
                  </p>
                </div>
              </li>
            )
          }
        })}
      </ul>
    </div>
  )
}
