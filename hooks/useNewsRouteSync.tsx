import { useEffect, ReactNode } from 'react'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import usePanelStore, { getPanelNewsItem } from '@/stores/panelStore'
import { NewsDetails } from '@/app/components/NewsDetails'
import { News } from '@/app/components/News'
import { buildContentSlug } from '@/app/utils/slug'

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
      // Read via getState() rather than closing over the hook, so this effect
      // depends only on slug/onNewsRoute/hasNewsList (mirrors useShopRouteSync).
      const { panelMode, panelContent, setPanelContent } = usePanelStore.getState()

      // Skip the fetch when NewsCard's click handler already set this exact
      // panel before the route caught up.
      if (panelMode === 'news' && isSameNewsSlug(panelContent, slug)) return

      const controller = new AbortController()
      fetch(`/api/updates/by-slug/${encodeURIComponent(slug)}`, { signal: controller.signal })
        .then(res => (res.ok ? res.json() : Promise.reject(new Error('News not found'))))
        .then(news => setPanelContent(<NewsDetails news={news} />, 'news'))
        .catch(err => {
          if (err.name === 'AbortError') return
          // Unresolvable slug or fetch failure: fall back to the list instead of
          // leaving the previous item's details showing under the new URL.
          console.error(err)
          setPanelContent(<News />, 'news')
        })
      return () => controller.abort()
    }

    if (hasNewsList) {
      usePanelStore.getState().setPanelContent(<News />, 'news')
    }
  }, [slug, onNewsRoute, hasNewsList])
}
