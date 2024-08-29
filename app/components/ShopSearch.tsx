import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { TShop } from '@/types/shop-types'
import shopGeoJSON from '@/data/coffee_shops.json'

interface IProps {
  handleResultClick: (shop: TShop) => void
}

export default function ShopSearch(props: IProps) {
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

  return (
    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
      <div className="flex justify-center flex-col mt-4 mx-4 sm:mx-6 ">
        <h3 className="font-bold text-xl">Search</h3>
        <p className="text-sm">
        Search for shops by name or neighborhood
        </p>
        <div className="my-2 border rounded-lg px-2 w-64 flex items-center justify-between">
          <span className="inline text-gray-500" aria-hidden="true">
            <MagnifyingGlassIcon className="h-4 w-4" />
          </span>
          <input
            className="inline h-12 outline-none active:outline text-gray-500 bg-transparent"
            onChange={e => setFilter(e.target.value)}
            placeholder="Search for a shop"
            value={filter}
          />
          <button className="inline ml-2 p-1 text-gray-500 hover:text-gray-600" onClick={handleFilterClear}>
            ×
          </button>
        </div>
      </div>

      <ul className="relative mt-6 flex-1 px-4 sm:px-6">
        {shopGeoJSON.features.map((shop: any) => {
          if (meetsFilterCriteria(shop) || !filter) {
            return (
              <li
                key={shop.properties.name + shop.properties.address}
                className="relative mb-4 rounded overflow-hidden shadow-md hover:cursor-pointer"
                onClick={() => handleCardClick(shop)}
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
