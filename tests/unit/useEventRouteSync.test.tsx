import { describe, test, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useEventRouteSync } from '@/hooks/useEventRouteSync'

const h = vi.hoisted(() => ({
  slug: undefined as string | undefined,
  pathname: '/' as string,
  search: '' as string,
  setPanelContent: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useParams: () => ({ slug: h.slug }),
  usePathname: () => h.pathname,
  useSearchParams: () => new URLSearchParams(h.search),
}))
vi.mock('@/stores/panelStore', () => ({
  __esModule: true,
  default: (selector?: (s: unknown) => unknown) => {
    const state = { setPanelContent: h.setPanelContent }
    return selector ? selector(state) : state
  },
}))
vi.mock('@/app/components/EventDetails', () => ({ EventDetails: () => null }))
vi.mock('@/app/components/Events', () => ({ Events: () => null }))

describe('useEventRouteSync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    h.slug = undefined
    h.pathname = '/'
    h.search = ''
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  test('opens the event panel for a /events/{slug} route', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: '1' }) }))
    h.slug = 'latte-art-throwdown-a1b2c3d4'
    h.pathname = '/events/latte-art-throwdown-a1b2c3d4'

    renderHook(() => useEventRouteSync())

    await waitFor(() =>
      expect(h.setPanelContent).toHaveBeenCalledWith(expect.anything(), 'event'),
    )
  })

  test('falls back to the events list when the event fetch fails', async () => {
    // The other sync hooks stand down their route-exit teardown for /events/{slug}
    // on the promise that this hook installs a panel, so a failure that installed
    // nothing would strand the panel the user navigated from.
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    h.slug = 'latte-art-throwdown-a1b2c3d4'
    h.pathname = '/events/latte-art-throwdown-a1b2c3d4'

    renderHook(() => useEventRouteSync())

    await waitFor(() =>
      expect(h.setPanelContent).toHaveBeenCalledWith(expect.anything(), 'events'),
    )
  })
})
