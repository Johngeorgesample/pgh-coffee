import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import NearbyShopRow from '@/app/components/NearbyShopRow'
import type { TShop } from '@/types/shop-types'

vi.mock('@/hooks', () => ({
  useShopSelection: () => ({ handleShopSelect: vi.fn() }),
  useAnalytics: () => vi.fn(),
}))

vi.mock('@/stores/coffeeShopsStore', () => ({
  __esModule: true,
  default: () => vi.fn(),
}))

const makeShop = (overrides: Partial<TShop['properties']> = {}): TShop =>
  ({
    type: 'Feature',
    properties: {
      company: null,
      name: 'Test Shop',
      neighborhood: 'Downtown',
      address: '',
      website: '',
      uuid: 'u1',
      ...overrides,
    },
    geometry: { type: 'Point', coordinates: [0, 0] },
  }) as TShop

describe('NearbyShopRow verified badge', () => {
  test('shows badge for a verified shop', () => {
    render(<NearbyShopRow shop={makeShop({ verified: true })} />)
    expect(screen.getByText('Verified')).toBeTruthy()
  })

  test('shows badge when the owning company is verified', () => {
    render(<NearbyShopRow shop={makeShop({ company: { is_verified: true } as TShop['properties']['company'] })} />)
    expect(screen.getByText('Verified')).toBeTruthy()
  })

  test('no badge for an unverified shop', () => {
    render(<NearbyShopRow shop={makeShop()} />)
    expect(screen.queryByText('Verified')).toBeNull()
  })
})
