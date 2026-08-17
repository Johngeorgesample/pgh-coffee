import { useEffect } from 'react'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import usePanelStore, { getPanelSlug } from '@/stores/panelStore'
import useShopsStore from '@/stores/coffeeShopsStore'
import { Company } from '@/app/components/Company'
import { ExploreContent } from '@/app/components/ExploreContent'
import { isPanelOwnedRoute, ownsMapFilter } from '@/app/utils/panelRoutes'

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
  const destinationOwnsPanel = !onCompanyRoute && isPanelOwnedRoute(pathname, searchParams)
  const destinationOwnsMapFilter = !onCompanyRoute && ownsMapFilter(pathname)

  // Store actions are read via getState() rather than closed over so the effect
  // depends only on the values below — no exhaustive-deps suppression.
  useEffect(() => {
    if (onCompanyRoute && slug) {
      const { panelMode, panelContent, setPanelContent } = usePanelStore.getState()

      // The panel back button pops to the company entry and then navigates back to
      // its route, which re-fires this effect. Pushing again would stack a
      // duplicate entry and swallow the next back press.
      if (panelMode === 'company' && getPanelSlug(panelContent) === slug) return

      setPanelContent(<Company slug={slug} />, 'company')
      return
    }

    // Leaving the company route releases the map filter <Company> set. Waiting for
    // its unmount isn't enough: on a handoff the destination's hook might never
    // install its panel (a transient /api/events failure, whose hook only logs),
    // leaving the map pinned to this company on a route that isn't its own. The
    // exception is a destination that installs its own filter — clearing there
    // would un-filter the map for the length of its fetch.
    if (!destinationOwnsMapFilter) useShopsStore.getState().setOverrideShops(null)

    // The panel itself only comes down when no other route-sync hook owns the
    // destination — resetting during a handoff would wipe the history its entry is
    // about to be pushed onto. The mode check keeps us off a news/events/search
    // panel that legitimately lives on the bare `/` route.
    if (destinationOwnsPanel) return
    if (usePanelStore.getState().panelMode === 'company') {
      usePanelStore.getState().reset({ mode: 'explore', content: <ExploreContent /> })
    }
  }, [slug, onCompanyRoute, destinationOwnsPanel, destinationOwnsMapFilter])
}
