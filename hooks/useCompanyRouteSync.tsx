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
    // its unmount isn't enough: the destination's hook may replace the panel late,
    // or not at all, leaving the map pinned to this company on a route that isn't
    // its own.
    //
    // The exception is narrow: it stops this hook from clearing a filter it doesn't
    // own on a /roasters/A -> /roasters/B move, where the slug dep re-fires this
    // effect while <RoasterDetails> still holds A's state. It does NOT keep the map
    // filtered across a company -> roaster move; <Company> unmounts there, and its
    // own cleanup clears the filter for the length of the roaster fetch.
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
