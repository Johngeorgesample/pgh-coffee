import { describe, test, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useRoasterRouteSync } from '@/hooks/useRoasterRouteSync'

const h = vi.hoisted(() => ({
  slug: undefined as string | undefined,
  pathname: '/' as string,
  search: '' as string,
  panelMode: 'explore' as string,
  panelSlug: undefined as string | undefined,
  setPanelContent: vi.fn(),
  reset: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useParams: () => ({ slug: h.slug }),
  usePathname: () => h.pathname,
  useSearchParams: () => new URLSearchParams(h.search),
}))
vi.mock('@/stores/panelStore', () => {
  const getState = () => ({
    panelMode: h.panelMode,
    panelContent: null,
    setPanelContent: h.setPanelContent,
    reset: h.reset,
  })
  const usePanelStore = (selector?: (s: unknown) => unknown) =>
    selector ? selector(getState()) : getState()
  usePanelStore.getState = getState
  return { __esModule: true, default: usePanelStore, getPanelSlug: () => h.panelSlug }
})
vi.mock('@/app/components/RoasterDetails', () => ({ RoasterDetails: () => null }))
vi.mock('@/app/components/ExploreContent', () => ({ ExploreContent: () => null }))

describe('useRoasterRouteSync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    h.slug = undefined
    h.pathname = '/'
    h.search = ''
    h.panelMode = 'explore'
    h.panelSlug = undefined
  })

  test('opens the roaster panel when on a /roasters/{slug} route', () => {
    h.slug = 'commonplace-coffee'
    h.pathname = '/roasters/commonplace-coffee'

    renderHook(() => useRoasterRouteSync())

    expect(h.setPanelContent).toHaveBeenCalledWith(expect.anything(), 'roaster')
  })

  test('does not fire on another [slug] route (e.g. an event page)', () => {
    // `slug` is shared by /shops, /events, /news and /roasters; the pathname
    // guard must keep this from claiming a non-roaster slug.
    h.slug = 'live-music-with-mila-bc4c66ef'
    h.pathname = '/events/live-music-with-mila-bc4c66ef'

    renderHook(() => useRoasterRouteSync())

    expect(h.setPanelContent).not.toHaveBeenCalled()
  })

  test('tears the roaster panel down when the route leaves /roasters', () => {
    h.slug = 'commonplace-coffee'
    h.pathname = '/roasters/commonplace-coffee'

    const { rerender } = renderHook(() => useRoasterRouteSync())

    h.panelMode = 'roaster'
    h.slug = undefined
    h.pathname = '/'
    rerender()

    expect(h.reset).toHaveBeenCalledWith({ mode: 'explore', content: expect.anything() })
  })

  test('hands the panel over instead of tearing it down when another route owns it', () => {
    // /news/{slug} loads asynchronously, so tearing down here would flash the
    // Explore panel — and run its mount effects — before the article arrives.
    h.panelMode = 'roaster'
    h.slug = 'commonplace-opens-in-bloomfield-a1b2c3'
    h.pathname = '/news/commonplace-opens-in-bloomfield-a1b2c3'

    renderHook(() => useRoasterRouteSync())

    expect(h.reset).not.toHaveBeenCalled()
  })

  test('leaves a non-roaster panel that lives on / alone', () => {
    h.panelMode = 'events'
    h.pathname = '/'

    renderHook(() => useRoasterRouteSync())

    expect(h.reset).not.toHaveBeenCalled()
  })
})
