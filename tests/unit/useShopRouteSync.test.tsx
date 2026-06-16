import { describe, test, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useShopRouteSync } from '@/hooks/useShopRouteSync'

const h = vi.hoisted(() => ({
  slug: undefined as string | undefined,
  shopState: { currentShop: {} as any, setCurrentShop: vi.fn() },
  panelState: { panelMode: 'explore' as string, reset: vi.fn(), setPanelContent: vi.fn() },
}))

vi.mock('next/navigation', () => ({ useParams: () => ({ slug: h.slug }) }))
vi.mock('@/stores/coffeeShopsStore', () => ({ __esModule: true, default: { getState: () => h.shopState } }))
vi.mock('@/stores/panelStore', () => ({ __esModule: true, default: { getState: () => h.panelState } }))
vi.mock('@/app/components/ShopDetails', () => ({ __esModule: true, default: () => null }))
vi.mock('@/app/components/ExploreContent', () => ({ ExploreContent: () => null }))

const shopWithUuid = {
  properties: { uuid: 'e3bd219a-c907-4b6c-9a78-d4c177bc7e1a', name: 'KLVN', neighborhood: 'Larimer' },
}

describe('useShopRouteSync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    h.slug = undefined
    h.shopState.currentShop = {}
    h.panelState.panelMode = 'explore'
    vi.stubGlobal('fetch', vi.fn())
  })

  test('leaving a shop route clears the current shop and resets the panel to explore', () => {
    h.slug = undefined
    h.shopState.currentShop = shopWithUuid
    h.panelState.panelMode = 'shop'

    renderHook(() => useShopRouteSync())

    expect(h.shopState.setCurrentShop).toHaveBeenCalledWith({})
    expect(h.panelState.reset).toHaveBeenCalledWith(expect.objectContaining({ mode: 'explore' }))
    expect(fetch).not.toHaveBeenCalled()
  })

  test('leaving a shop route does not disturb a non-shop panel (e.g. company)', () => {
    h.slug = undefined
    h.shopState.currentShop = {}
    h.panelState.panelMode = 'company'

    renderHook(() => useShopRouteSync())

    expect(h.panelState.reset).not.toHaveBeenCalled()
  })

  test('a failed slug fetch clears the stale shop panel instead of leaving it visible', async () => {
    h.slug = 'bad-slug-deadbeef'
    h.shopState.currentShop = shopWithUuid // stale previously-viewed shop
    h.panelState.panelMode = 'shop'
    ;(fetch as any).mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({ message: 'Error fetching shop' }) })

    renderHook(() => useShopRouteSync())

    await waitFor(() => {
      expect(h.shopState.setCurrentShop).toHaveBeenCalledWith({})
      expect(h.panelState.reset).toHaveBeenCalledWith(expect.objectContaining({ mode: 'explore' }))
    })
  })

  test('does not refetch when the current shop already matches the slug', () => {
    h.slug = 'klvn-larimer-e3bd219a'
    h.shopState.currentShop = shopWithUuid

    renderHook(() => useShopRouteSync())

    expect(fetch).not.toHaveBeenCalled()
  })
})
