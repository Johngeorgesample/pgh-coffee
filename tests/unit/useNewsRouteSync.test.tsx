import { describe, test, expect, beforeEach, vi } from 'vitest'
import { createElement } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { useNewsRouteSync } from '@/hooks/useNewsRouteSync'
import { News } from '@/app/components/News'

const h = vi.hoisted(() => ({
  slug: undefined as string | undefined,
  pathname: '/' as string,
  searchParams: new URLSearchParams(),
  panelState: { panelMode: 'explore' as string, panelContent: null as any, setPanelContent: vi.fn() },
}))

vi.mock('next/navigation', () => ({
  useParams: () => ({ slug: h.slug }),
  usePathname: () => h.pathname,
  useSearchParams: () => h.searchParams,
}))
vi.mock('@/stores/panelStore', async () => {
  const actual = await vi.importActual<typeof import('@/stores/panelStore')>('@/stores/panelStore')
  return { __esModule: true, default: { getState: () => h.panelState }, getPanelNewsItem: actual.getPanelNewsItem }
})
vi.mock('@/app/components/NewsDetails', () => ({ NewsDetails: () => null }))
vi.mock('@/app/components/News', () => ({ News: () => null }))

const newsItem = { id: 'a1b2c3d4-0000-0000-0000-000000000000', title: 'Commonplace adds a new roast' }

describe('useNewsRouteSync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    h.slug = undefined
    h.pathname = '/'
    h.searchParams = new URLSearchParams()
    h.panelState.panelMode = 'explore'
    h.panelState.panelContent = null
    vi.stubGlobal('fetch', vi.fn())
  })

  test('does not refetch when NewsCard already set this exact panel', () => {
    h.slug = 'commonplace-adds-a-new-roast-a1b2c3d4'
    h.pathname = `/news/${h.slug}`
    h.panelState.panelMode = 'news'
    h.panelState.panelContent = createElement('div', { news: newsItem })

    renderHook(() => useNewsRouteSync())

    expect(fetch).not.toHaveBeenCalled()
  })

  test('refetches instead of crashing when the shown item has no title', async () => {
    h.slug = 'commonplace-adds-a-new-roast-a1b2c3d4'
    h.pathname = `/news/${h.slug}`
    h.panelState.panelMode = 'news'
    h.panelState.panelContent = createElement('div', { news: { id: newsItem.id, title: '' } })
    ;(fetch as any).mockResolvedValueOnce({ ok: true, json: async () => newsItem })

    renderHook(() => useNewsRouteSync())

    await waitFor(() => expect(fetch).toHaveBeenCalled())
  })

  test('fetches by slug when the panel does not already show this news item', async () => {
    h.slug = 'commonplace-adds-a-new-roast-a1b2c3d4'
    h.pathname = `/news/${h.slug}`
    h.panelState.panelMode = 'explore'
    ;(fetch as any).mockResolvedValueOnce({ ok: true, json: async () => newsItem })

    renderHook(() => useNewsRouteSync())

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`/api/updates/by-slug/${h.slug}`, expect.anything())
      expect(h.panelState.setPanelContent).toHaveBeenCalledWith(expect.anything(), 'news')
    })
  })

  test('falls back to the news list when the fetch fails, so stale details do not linger', async () => {
    h.slug = 'some-other-item-99999999'
    h.pathname = `/news/${h.slug}`
    h.panelState.panelMode = 'news'
    h.panelState.panelContent = createElement('div', { news: newsItem })
    ;(fetch as any).mockResolvedValueOnce({ ok: false, status: 404 })
    vi.spyOn(console, 'error').mockImplementation(() => {})

    renderHook(() => useNewsRouteSync())

    await waitFor(() => {
      const [content] = h.panelState.setPanelContent.mock.calls.at(-1)
      expect(content.type).toBe(News)
    })
  })
})
