'use client'

import { useState } from 'react'
import ShopCard from '@/app/components/ShopCard'
import CoffeeShops from '@/data/coffee_shops.json'
import Footer from '@/app/components/Footer'

export default function Home() {
  const [neighborhoodFilter, setNeighborhoodFilter] = useState(null)

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center mt-2">
          <h1 className="text-4xl pb-6">pgh.coffee</h1>
          <h3 className="text-center">A guide to every coffee shop in Pittsburgh, PA</h3>
          <hr className="my-4 w-1/2 m-auto" />
        </div>

        { neighborhoodFilter && <button onClick={() => setNeighborhoodFilter(null)}>Clear filter</button> }
        <div className="grid grid-cols-3 gap-4 px-4">
          {CoffeeShops.map((shop) => {
            if (neighborhoodFilter && shop.neighborhood === neighborhoodFilter) {
              return <ShopCard key={shop.address} shop={shop} onShopClick={(shopName: any) => setNeighborhoodFilter(shopName)}/>
            }
            if (!neighborhoodFilter) {
              return <ShopCard key={shop.address} shop={shop} onShopClick={(shopName: any) => setNeighborhoodFilter(shopName)}/>
            }
          }
          )}
        </div>

      </main>
    <Footer />
    </>
  )
}
