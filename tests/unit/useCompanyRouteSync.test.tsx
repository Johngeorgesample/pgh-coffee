import { describe, test, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCompanyRouteSync } from '@/hooks/useCompanyRouteSync'

const h = vi.hoisted(() => ({
  slug: undefined as string | undefined,
  pathname: '/' as string,
  setPanelContent: vi.fn(),
}))

vi.mock('next/navigation', () => ({ useParams: () => ({ slug: h.slug }), usePathname: () => h.pathname }))
vi.mock('@/stores/panelStore', () => ({ __esModule: true, default: () => ({ setPanelContent: h.setPanelContent }) }))
vi.mock('@/app/components/Company', () => ({ Company: () => null }))

describe('useCompanyRouteSync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    h.slug = undefined
    h.pathname = '/'
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
})
