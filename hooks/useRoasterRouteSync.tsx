import { useEffect } from 'react'
import { useParams, usePathname } from 'next/navigation'
import usePanelStore from '@/stores/panelStore'
import { RoasterDetails } from '@/app/components/RoasterDetails'
import { ExploreContent } from '@/app/components/ExploreContent'

/**
 * Syncs the panel from the roaster route: `/roasters/{slug}` opens a single
 * roaster. The `slug` param is shared by every `[slug]` route, so the
 * `/roasters/` pathname guard keeps this from firing on shop/event/news pages.
 */
export const useRoasterRouteSync = () => {
  const { slug } = useParams<{ slug?: string }>()
  const pathname = usePathname()

  const onRoasterRoute = pathname.startsWith('/roasters/')

  // Store actions are read via getState() rather than closed over so the effect
  // depends only on `slug` and `onRoasterRoute` — no exhaustive-deps suppression.
  useEffect(() => {
    if (onRoasterRoute && slug) {
      usePanelStore.getState().setPanelContent(<RoasterDetails slug={slug} />, 'roaster')
      return
    }

    // Same leak as the company route: <RoasterDetails> only releases its
    // overrideShops on unmount, so a panel that outlives its route keeps the map
    // filtered to that roaster's stockists on `/`.
    if (usePanelStore.getState().panelMode === 'roaster') {
      usePanelStore.getState().reset({ mode: 'explore', content: <ExploreContent /> })
    }
  }, [slug, onRoasterRoute])
}
