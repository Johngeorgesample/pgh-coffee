'use client'

import { useEffect } from 'react'
import { ListChips } from './Explore/ListChips'
import FeaturedShop from './Explore/FeaturedShop'
import { EventsCTA } from './Explore/EventsCTA'
import { CTAPhotoGrid } from './Explore/CTAPhotoGrid'
import usePanelStore from '@/stores/panelStore'

export const ExploreContent = () => {
  const { setSearchValue } = usePanelStore()
  useEffect(() => {
    console.log('clearing')
    setSearchValue('')
  }, [])
  return (
    <div className="flex overflow-y-auto flex-col sm:grid sm:grid-cols-2 gap-4 px-6 lg:px-4 lg:mt-16">
      <CTAPhotoGrid />
      <ListChips />
      <EventsCTA />
      <FeaturedShop />
    </div>
  )
}
