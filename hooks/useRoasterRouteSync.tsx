import { useEffect } from 'react'
import { useParams, usePathname } from 'next/navigation'
import usePanelStore from '@/stores/panelStore'
import { RoasterDetails } from '@/app/components/RoasterDetails'

/**
 * Syncs the panel from the roaster route: `/roasters/{slug}` opens a single
 * roaster. The `slug` param is shared by every `[slug]` route, so the
 * `/roasters/` pathname guard keeps this from firing on shop/event/news pages.
 */
export const useRoasterRouteSync = () => {
  const { slug } = useParams<{ slug?: string }>()
  const pathname = usePathname()
  const { setPanelContent } = usePanelStore()

  const onRoasterRoute = pathname.startsWith('/roasters/')

  useEffect(() => {
    if (onRoasterRoute && slug) {
      setPanelContent(<RoasterDetails slug={slug} />, 'roaster')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, onRoasterRoute])
}
