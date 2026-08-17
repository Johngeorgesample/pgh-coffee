import { useEffect } from 'react'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import usePanelStore from '@/stores/panelStore'
import useShopsStore from '@/stores/coffeeShopsStore'
import { Company } from '@/app/components/Company'
import { ExploreContent } from '@/app/components/ExploreContent'
import { isPanelOwnedRoute } from '@/app/utils/panelRoutes'

/**
 * Syncs the panel from the company route: `/companies/{slug}` opens a single
 * company. The `slug` param is shared by every `[slug]` route, so the
 * `/companies/` pathname guard keeps this from firing on shop/event/news/roaster
 * pages.
 */
export const useCompanyRouteSync = () => {
  const { slug } = useParams<{ slug?: string }>()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const onCompanyRoute = pathname.startsWith('/companies/')
  const destinationOwnsPanel = isPanelOwnedRoute(pathname, searchParams)

  // Store actions are read via getState() rather than closed over so the effect
  // depends only on the values below — no exhaustive-deps suppression.
  useEffect(() => {
    if (onCompanyRoute && slug) {
      usePanelStore.getState().setPanelContent(<Company slug={slug} />, 'company')
      return
    }

    // Leaving the company route always releases the map filter <Company> set.
    // Waiting for its unmount isn't enough: on a handoff the destination's hook
    // might never install its panel (a dead event slug, whose hook only logs), and
    // the map would stay pinned to this company on a route that isn't its own.
    useShopsStore.getState().setOverrideShops(null)

    // The panel itself only comes down when no other route-sync hook owns the
    // destination — resetting during a handoff would wipe the history its entry is
    // about to be pushed onto. The mode check keeps us off a news/events/search
    // panel that legitimately lives on the bare `/` route.
    if (destinationOwnsPanel) return
    if (usePanelStore.getState().panelMode === 'company') {
      usePanelStore.getState().reset({ mode: 'explore', content: <ExploreContent /> })
    }
  }, [slug, onCompanyRoute, destinationOwnsPanel])
}
