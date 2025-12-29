'use client'

import { useEffect } from 'react'
import { TShop } from '@/types/shop-types'
import { ListChips } from './Explore/ListChips'
import FeaturedShop from './Explore/FeaturedShop'
import { EventsCTA } from './Explore/EventsCTA'
import { NewsCTA } from './Explore/NewsCTA'
import { News } from './News'
import { CTAPhotoGrid } from './Explore/CTAPhotoGrid'
import usePanelStore from '@/stores/panelStore'

import useShopsStore from '@/stores/coffeeShopsStore'
import { CuratedListIndex } from './CuratedListIndex'
export const ExploreContent = () => {
  const { setSearchValue } = usePanelStore()
  const { fetchCoffeeShops, setCurrentShop, setHoveredShop } = useShopsStore()
  useEffect(() => {
    setSearchValue('')
    fetchCoffeeShops()
    setCurrentShop({} as TShop)
    setHoveredShop({} as TShop)
  }, [])

  return (
    <div className="flex overflow-y-auto flex-col sm:grid gap-4 px-6 lg:px-4 lg:mt-16">
      {/*
      <CTAPhotoGrid />
      <ListChips />
      <EventsCTA />
      <FeaturedShop />
      */}
      <div>
        <h3 className="uppercase text-xs">Curated lists</h3>
        {/*
        <CuratedListIndex />
        */}
      </div>
      <div>
        <NewsCTA />
      </div>
      <div>
        <EventsCTA />
      </div>
      <div>
        <h3 className="uppercase text-xs">Featured shop</h3>
        <FeaturedShop />
      </div>
    </div>
  )
}
