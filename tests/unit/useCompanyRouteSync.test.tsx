import { describe, test, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCompanyRouteSync } from '@/hooks/useCompanyRouteSync'

const h = vi.hoisted(() => ({
  slug: undefined as string | undefined,
  pathname: '/' as string,
  setPanelContent: vi.fn(),
  reset: vi.fn(),
  panelMode: null as string | null,
}))

vi.mock('next/navigation', () => ({ useParams: () => ({ slug: h.slug }), usePathname: () => h.pathname }))
vi.mock('@/stores/panelStore', () => {
  const getState = () => ({ setPanelContent: h.setPanelContent, reset: h.reset, panelMode: h.panelMode })
  const store = (selector?: (s: unknown) => unknown) => (selector ? selector(getState()) : getState())
  store.getState = getState
  return { __esModule: true, default: store }
})
vi.mock('@/app/components/Company', () => ({ Company: () => null }))

describe('useCompanyRouteSync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    h.slug = undefined
    h.pathname = '/'
    h.panelMode = null
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

  test('clears the company panel when the route is left with the panel still showing', () => {
    // "Go home" from a 404 is a bare <Link href="/">, so it never runs
    // handleClose — without this the company panel outlives its route.
    h.pathname = '/'
    h.panelMode = 'company'

    renderHook(() => useCompanyRouteSync())

    expect(h.reset).toHaveBeenCalledWith(expect.objectContaining({ mode: 'explore' }))
  })

  test('leaves a panel another route owns alone', () => {
    h.pathname = '/roasters/commonplace-coffee'
    h.panelMode = 'roaster'

    renderHook(() => useCompanyRouteSync())

    expect(h.reset).not.toHaveBeenCalled()
  })
})
