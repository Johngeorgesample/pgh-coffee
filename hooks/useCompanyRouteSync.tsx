import { useEffect } from 'react'
import { useParams, usePathname } from 'next/navigation'
import usePanelStore from '@/stores/panelStore'
import { Company } from '@/app/components/Company'
import { ExploreContent } from '@/app/components/ExploreContent'

/**
 * Syncs the panel from the company route: `/companies/{slug}` opens a single
 * company. The `slug` param is shared by every `[slug]` route, so the
 * `/companies/` pathname guard keeps this from firing on shop/event/news/roaster
 * pages.
 */
export const useCompanyRouteSync = () => {
  const { slug } = useParams<{ slug?: string }>()
  const pathname = usePathname()

  const onCompanyRoute = pathname.startsWith('/companies/')

  // Store actions are read via getState() rather than closed over so the effect
  // depends only on `slug` and `onCompanyRoute` — no exhaustive-deps suppression.
  useEffect(() => {
    if (onCompanyRoute && slug) {
      usePanelStore.getState().setPanelContent(<Company slug={slug} />, 'company')
      return
    }

    // Leaving the company route (browser Back, say): drop the panel so <Company>
    // unmounts and releases the overrideShops it set, otherwise the map on `/`
    // stays filtered to that company. Guarded on the mode so we don't clobber a
    // news/events/search panel that legitimately lives on the bare `/` route.
    if (usePanelStore.getState().panelMode === 'company') {
      usePanelStore.getState().reset({ mode: 'explore', content: <ExploreContent /> })
    }
  }, [slug, onCompanyRoute])
}
