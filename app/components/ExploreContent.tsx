'use client'

import { ListChips } from './Explore/ListChips'
import FeaturedShop from './Explore/FeaturedShop'
import { EventsCTA } from './Explore/EventsCTA'
import { CTAPhotoGrid } from './Explore/CTAPhotoGrid'

export const ExploreContent = () => {
  return (
    <div className="flex h-full overflow-y-auto flex-col sm:grid sm:grid-cols-2 gap-4 px-6 lg:px-4 lg:mt-16">
      <CTAPhotoGrid />
      <ListChips />
      <EventsCTA />
      <FeaturedShop />
      <p>korem ipsum</p>
    </div>
  )
}
