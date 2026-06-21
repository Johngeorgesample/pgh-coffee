import { useEffect } from 'react'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import usePanelStore from '@/stores/panelStore'
import { NewsDetails } from '@/app/components/NewsDetails'
import { News } from '@/app/components/News'

/**
 * Syncs the panel from the news routes: `/news/{slug}` opens a single update,
 * `/?news` opens the news list. The `slug` param is shared by every `[slug]`
 * route, so the `/news/` pathname guard keeps this from firing on shop/event
 * pages.
 */
export const useNewsRouteSync = () => {
  const { slug } = useParams<{ slug?: string }>()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { setPanelContent } = usePanelStore()

  const onNewsRoute = pathname.startsWith('/news/')
  const hasNewsList = searchParams.has('news')

  useEffect(() => {
    if (onNewsRoute && slug) {
      fetch(`/api/updates/by-slug/${encodeURIComponent(slug)}`)
        .then(res => (res.ok ? res.json() : Promise.reject(new Error('News not found'))))
        .then(news => setPanelContent(<NewsDetails id={news.id} title={news.title} />, 'news'))
        .catch(console.error)
      return
    }

    if (hasNewsList) {
      setPanelContent(<News />, 'news')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, onNewsRoute, hasNewsList])
}
