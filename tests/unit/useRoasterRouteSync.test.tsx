import { describe, test, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useRoasterRouteSync } from '@/hooks/useRoasterRouteSync'

const h = vi.hoisted(() => ({
  slug: undefined as string | undefined,
  pathname: '/' as string,
  setPanelContent: vi.fn(),
}))

vi.mock('next/navigation', () => ({ useParams: () => ({ slug: h.slug }), usePathname: () => h.pathname }))
vi.mock('@/stores/panelStore', () => ({ __esModule: true, default: () => ({ setPanelContent: h.setPanelContent }) }))
vi.mock('@/app/components/RoasterDetails', () => ({ RoasterDetails: () => null }))

describe('useRoasterRouteSync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    h.slug = undefined
    h.pathname = '/'
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
})
