import { useEffect } from 'react'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import usePanelStore from '@/stores/panelStore'
import { RoasterDetails } from '@/app/components/RoasterDetails'
import { ExploreContent } from '@/app/components/ExploreContent'
import { isPanelOwnedRoute } from '@/app/utils/panelRoutes'

/**
 * Syncs the panel from the roaster route: `/roasters/{slug}` opens a single
 * roaster. The `slug` param is shared by every `[slug]` route, so the
 * `/roasters/` pathname guard keeps this from firing on shop/event/news pages.
 */
export const useRoasterRouteSync = () => {
  const { slug } = useParams<{ slug?: string }>()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const onRoasterRoute = pathname.startsWith('/roasters/')
  const destinationOwnsPanel = isPanelOwnedRoute(pathname, searchParams)

  // Store actions are read via getState() rather than closed over so the effect
  // depends only on the values below — no exhaustive-deps suppression.
  useEffect(() => {
    if (onRoasterRoute && slug) {
      usePanelStore.getState().setPanelContent(<RoasterDetails slug={slug} />, 'roaster')
      return
    }

    // Same leak, and same handoff caveat, as the company route: <RoasterDetails>
    // only releases its overrideShops on unmount, so a panel that outlives its
    // route keeps the map filtered to that roaster's stockists on `/`.
    if (destinationOwnsPanel) return
    if (usePanelStore.getState().panelMode === 'roaster') {
      usePanelStore.getState().reset({ mode: 'explore', content: <ExploreContent /> })
    }
  }, [slug, onRoasterRoute, destinationOwnsPanel])
}
