import { useEffect } from 'react'
import { useParams, usePathname } from 'next/navigation'
import usePanelStore from '@/stores/panelStore'
import { Company } from '@/app/components/Company'

/**
 * Syncs the panel from the company route: `/companies/{slug}` opens a single
 * company. The `slug` param is shared by every `[slug]` route, so the
 * `/companies/` pathname guard keeps this from firing on shop/event/news/roaster
 * pages.
 */
export const useCompanyRouteSync = () => {
  const { slug } = useParams<{ slug?: string }>()
  const pathname = usePathname()
  const { setPanelContent } = usePanelStore()

  const onCompanyRoute = pathname.startsWith('/companies/')

  useEffect(() => {
    if (onCompanyRoute && slug) {
      setPanelContent(<Company slug={slug} />, 'company')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, onCompanyRoute])
}
