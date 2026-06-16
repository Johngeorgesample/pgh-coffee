import { describe, test, expect, beforeEach, vi } from 'vitest'
import { render } from '@testing-library/react'
import ShopSeed from '@/app/(map)/shops/[slug]/ShopSeed'

const h = vi.hoisted(() => ({
  shopState: { currentShop: {} as any, setCurrentShop: vi.fn() },
  panelState: { setPanelContent: vi.fn() },
}))

vi.mock('@/stores/coffeeShopsStore', () => ({ __esModule: true, default: { getState: () => h.shopState } }))
vi.mock('@/stores/panelStore', () => ({ __esModule: true, default: { getState: () => h.panelState } }))
vi.mock('@/app/components/ShopDetails', () => ({ __esModule: true, default: () => null }))

const shop = {
  properties: { uuid: 'e3bd219a-c907-4b6c-9a78-d4c177bc7e1a', name: 'KLVN', neighborhood: 'Larimer' },
} as any

describe('ShopSeed', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    h.shopState.currentShop = {}
  })

  test('seeds the store from the server-rendered shop when nothing is selected', () => {
    render(<ShopSeed shop={shop} />)

    expect(h.shopState.setCurrentShop).toHaveBeenCalledWith(shop)
    expect(h.panelState.setPanelContent).toHaveBeenCalledWith(expect.anything(), 'shop')
  })

  test('skips re-seeding when that shop is already selected (e.g. via map-pin click)', () => {
    h.shopState.currentShop = shop

    render(<ShopSeed shop={shop} />)

    expect(h.shopState.setCurrentShop).not.toHaveBeenCalled()
    expect(h.panelState.setPanelContent).not.toHaveBeenCalled()
  })
})
