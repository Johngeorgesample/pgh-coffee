import { describe, test, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCompanyRouteSync } from '@/hooks/useCompanyRouteSync'

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
vi.mock('@/app/components/Company', () => ({ Company: () => null }))
vi.mock('@/app/components/ExploreContent', () => ({ ExploreContent: () => null }))

describe('useCompanyRouteSync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    h.slug = undefined
    h.pathname = '/'
    h.search = ''
    h.panelMode = 'explore'
    h.panelSlug = undefined
  })

  test('opens the company panel when on a /companies/{slug} route', () => {
    h.slug = 'commonplace-coffee-co'
    h.pathname = '/companies/commonplace-coffee-co'

    renderHook(() => useCompanyRouteSync())

    expect(h.setPanelContent).toHaveBeenCalledWith(expect.anything(), 'company')
  })

  test('does not fire on another [slug] route (e.g. a roaster page)', () => {
    // `slug` is shared by /shops, /events, /news, /roasters and /companies; the
    // pathname guard must keep this from claiming a non-company slug.
    h.slug = 'commonplace-coffee'
    h.pathname = '/roasters/commonplace-coffee'

    renderHook(() => useCompanyRouteSync())

    expect(h.setPanelContent).not.toHaveBeenCalled()
  })

  test('tears the company panel down when the route leaves /companies', () => {
    h.slug = 'commonplace-coffee-co'
    h.pathname = '/companies/commonplace-coffee-co'

    const { rerender } = renderHook(() => useCompanyRouteSync())

    h.panelMode = 'company'
    h.slug = undefined
    h.pathname = '/'
    rerender()

    expect(h.reset).toHaveBeenCalledWith({ mode: 'explore', content: expect.anything() })
  })

  test('leaves a non-company panel that lives on / alone', () => {
    // /?news and /?events render their panels on the bare `/` route, so exiting
    // the company route must not reset a panel it never owned.
    h.panelMode = 'news'
    h.pathname = '/'

    renderHook(() => useCompanyRouteSync())

    expect(h.reset).not.toHaveBeenCalled()
  })

  test('does not re-push a panel that already shows this company', () => {
    h.panelMode = 'company'
    h.panelSlug = 'commonplace-coffee-co'
    h.slug = 'commonplace-coffee-co'
    h.pathname = '/companies/commonplace-coffee-co'

    renderHook(() => useCompanyRouteSync())

    expect(h.setPanelContent).not.toHaveBeenCalled()
  })

  test('hands the panel over instead of tearing it down when another route owns it', () => {
    // The roaster hook replaces the panel itself; resetting here would wipe the
    // history its entry is about to be pushed onto, breaking the back arrow.
    h.panelMode = 'company'
    h.slug = 'commonplace-roasting'
    h.pathname = '/roasters/commonplace-roasting'

    renderHook(() => useCompanyRouteSync())

    expect(h.reset).not.toHaveBeenCalled()
  })

  test('does not tear down while moving between two companies', () => {
    h.slug = 'commonplace-coffee-co'
    h.pathname = '/companies/commonplace-coffee-co'

    const { rerender } = renderHook(() => useCompanyRouteSync())

    h.panelMode = 'company'
    h.slug = 'de-fer-coffee-tea'
    h.pathname = '/companies/de-fer-coffee-tea'
    rerender()

    expect(h.reset).not.toHaveBeenCalled()
    expect(h.setPanelContent).toHaveBeenCalledTimes(2)
  })
})
