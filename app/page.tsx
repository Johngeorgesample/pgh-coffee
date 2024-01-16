'use client'

import { useState } from 'react'
import ShopCard from '@/app/components/ShopCard'
import CoffeeShops from '@/data/coffee_shops.json'
import Footer from '@/app/components/Footer'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function Home() {
  const [filter, setFilter] = useState('')

  const coffeeShops = [...CoffeeShops]
  coffeeShops.sort((a, b) => a.neighborhood.localeCompare(b.neighborhood))

  const handleFormChange = (e: any) => {
    setFilter(e.target.value)
  }

  const meetsFilterCriteria = (shop: any) => {
    const shopCardText = `${shop.neighborhood.toLowerCase()} ${shop.name.toLowerCase()}`
    return shopCardText.includes(filter.toLowerCase())
  }

  return (
    <>
      <main className="flex min-h-[calc(100vh-72px)] flex-col items-center">
        <div className="flex justify-center items-center flex-col absolute top-0 h-56">
          <div className="flex flex-col items-center mt-2">
            <h1 className="text-4xl pb-6">pgh.coffee</h1>
            <h3 className="text-center">A guide to every coffee shop in Pittsburgh, PA</h3>
            <hr className="my-4 w-1/2 m-auto" />
          </div>

          <div className="mb-2 border rounded-lg px-2 w-64 flex items-center justify-between">
            <span className="inline text-gray-500" aria-hidden="true">
              <MagnifyingGlassIcon className="h-4 w-4" />
            </span>
            <input
              className="inline h-12 outline-none active:outline text-gray-500 bg-transparent"
              onChange={handleFormChange}
              placeholder="Search for a shop"
              value={filter}
            />
            <button className="inline ml-2 p-1 text-gray-500 hover:text-gray-600" onClick={() => setFilter('')}>×</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 px-4 mt-56">
          {coffeeShops.map((shop) => {
            if (meetsFilterCriteria(shop)) {
              return (
                <ShopCard
                  key={shop.address}
                  onShopClick={(shopName: any) => setFilter(shopName)}
                  shop={shop}
                />
              )
            }
          })}
        </div>

      </main>
    <Footer />
    </>
  )
}
