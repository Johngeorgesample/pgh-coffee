'use client'

import useShopsStore from '@/stores/coffeeShopsStore'


export const Explore = () => {
  const { coffeeShops } = useShopsStore()

  return (
    <div className="flex overflow-y-auto flex-col sm:grid gap-4 px-6 lg:px-4 lg:mt-16">
      <p>pgh.coffee - discover great coffee in Pittsburgh</p>
      <p>{coffeeShops?.features?.length} shops and counting</p>
    </div>
  )
}
