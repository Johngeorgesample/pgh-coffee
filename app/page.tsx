'use client'

import { useState, useMemo } from 'react'
import ShopCard from '@/app/components/ShopCard'
import CoffeeShops from '@/data/coffee_shops.json'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function Home({ searchParams }: { searchParams: any }) {
  const [filter, setFilter] = useState('')

  useMemo(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const myParam = params.get('neighborhood')
      if (myParam) {
        setFilter(myParam)
      }
    } else {
      if (searchParams) {
        setFilter(searchParams.neighborhood)
      }
    }
  }, [])

  const coffeeShops = [...CoffeeShops]
  coffeeShops.sort((a, b) => a.neighborhood.localeCompare(b.neighborhood))

  const handleFormChange = (e: any) => {
    setFilter(e.target.value)
  }

  const handleFilterClear = () => {
    setFilter('')
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      const params = new URLSearchParams(url.search)
      params.delete('neighborhood')
      url.search = params.toString()
      history.replaceState({}, '', url.toString())
    }
  }

  const meetsFilterCriteria = (shop: any) => {
    if (filter) {
      const shopCardText = `${shop.neighborhood.toLowerCase()} ${shop.name.toLowerCase()}`
      return shopCardText.includes(filter.toLowerCase())
    }
  }

  return (
    <>
      <main className="flex min-h-[calc(100vh-72px)] flex-col items-center">
        <div className="flex justify-center items-center flex-col absolute top-0 h-56">

          <Header />
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
            <button className="inline ml-2 p-1 text-gray-500 hover:text-gray-600" onClick={handleFilterClear}>
              ×
            </button>
          </div>
        </div>

        <div className="grid-cols-3 gap-4 px-4 mt-56 block md:grid">
          {coffeeShops.map(shop => {
            if (meetsFilterCriteria(shop) || !filter) {
              return <ShopCard key={shop.address} onShopClick={(shopName: any) => setFilter(shopName)} shop={shop} />
            }
          })}
        </div>
      </main>
      <Footer />
    </>
  )
}
