'use client'

import useShopsStore from '@/stores/coffeeShopsStore'
import ShopSearch from './ShopSearch'
import ShopList from './ShopList'


export const Explore = () => {
  const { coffeeShops } = useShopsStore()

  return (
    <div className="flex overflow-y-auto flex-col sm:grid gap-4 px-6 lg:px-4">
    <p>Explore</p>
      <ShopList handleResultClick={() => {}}/>
    </div>
  )
}
