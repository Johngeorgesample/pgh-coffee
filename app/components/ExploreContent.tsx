'use client'

import { CuratedListIndex } from './CuratedListIndex'
import usePanelStore from '@/stores/panelStore'
import ShopSearch from '@/app/components/ShopSearch'

interface IProps {}

export const ExploreContent = (props: IProps) => {
  const { searchValue, setSearchValue, panelContent, setPanelContent } = usePanelStore()

  return (
    <div className="mt-20">
      <section>🔥 Trending shops</section>
      <section>📍 Explore by neighborhood</section>
      <section>🆕 Recently Added</section>
      <section>
        <button onClick={() => setPanelContent(<CuratedListIndex />)}>☕️ Staff Picks / Curated Lists</button>
      </section>
      <section>
        <button onClick={() => setPanelContent(<ShopSearch />)}>🗺️ View All Shops (Deprioritized)</button>
      </section>
    </div>
  )
}
