'use client'

import { useEffect } from 'react'
import { TShop } from '@/types/shop-types'
import FeaturedShop from './Explore/FeaturedShop'
import { EventsCTA } from './Explore/EventsCTA'
import { NewsCTA } from './Explore/NewsCTA'
import usePanelStore from '@/stores/panelStore'

import useShopsStore from '@/stores/coffeeShopsStore'
export const ExploreContent = () => {
  const { setSearchValue } = usePanelStore()
  const { fetchCoffeeShops, setCurrentShop, setHoveredShop } = useShopsStore()
  useEffect(() => {
    setSearchValue('')
    fetchCoffeeShops()
    setCurrentShop({} as TShop)
    setHoveredShop({} as TShop)
    // only run on mount
    // eslint-disable-next-line
  }, [])

  return (
    <div className="flex overflow-y-auto flex-col sm:grid gap-4 px-6 lg:px-4 lg:mt-16">
      <div>
        <NewsCTA />
      </div>
      <div>
        <EventsCTA />
      </div>
      <div>
        <FeaturedShop />
      </div>
    </div>
  )
}
