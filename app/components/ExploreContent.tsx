'use client'

import { ListChips } from './Explore/ListChips'
import  FeaturedShop  from './Explore/FeaturedShop'
import { EventsCTA } from './Explore/EventsCTA'
import { CTAPhotoGrid } from './Explore/CTAPhotoGrid'

export const ExploreContent = () => {
  return (
    <div className="mt-16 px-4 sm:px-6">
      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
        <CTAPhotoGrid />
        <ListChips />
        <EventsCTA />
        <FeaturedShop />
      </div>
    </div>
  )
}
