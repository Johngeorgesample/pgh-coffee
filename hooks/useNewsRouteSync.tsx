import { useEffect, ReactNode } from 'react'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import usePanelStore, { getPanelNewsItem } from '@/stores/panelStore'
import { NewsDetails } from '@/app/components/NewsDetails'
import { News } from '@/app/components/News'
import { buildContentSlug } from '@/app/utils/slug'
import { clearOwnPanel } from './clearOwnPanel'

const isSameNewsSlug = (content: ReactNode, slug: string) => {
  const news = getPanelNewsItem(content)
  return !!news?.id && !!news?.title && buildContentSlug({ id: news.id, title: news.title }) === slug
}

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

  const onNewsRoute = pathname.startsWith('/news/')
  const hasNewsList = searchParams.has('news')

  useEffect(() => {
    if (onNewsRoute && slug) {
      const { panelMode, panelContent, setPanelContent } = usePanelStore.getState()

      if (panelMode === 'news' && isSameNewsSlug(panelContent, slug)) return

      const controller = new AbortController()
      fetch(`/api/updates/by-slug/${encodeURIComponent(slug)}`, { signal: controller.signal })
        .then(res => (res.ok ? res.json() : Promise.reject(new Error('News not found'))))
        .then(news => setPanelContent(<NewsDetails news={news} />, 'news'))
        .catch(err => {
          if (err.name === 'AbortError') return
          console.error(err)
          setPanelContent(<News />, 'news')
        })
      return () => controller.abort()
    }

    if (hasNewsList) {
      usePanelStore.getState().setPanelContent(<News />, 'news')
      return
    }

    clearOwnPanel('news')
  }, [slug, onNewsRoute, hasNewsList])
}
