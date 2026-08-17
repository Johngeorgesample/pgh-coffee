import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import NearbyShopRow from '@/app/components/NearbyShopRow'
import type { TShop } from '@/types/shop-types'
import { DEFAULT_UNITS, DISTANCE_UNITS } from '@/types/unit-types'

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

// Regression for the "distances never render" bug: the units prop used to come
// straight from localStorage, so it was `null` for anyone who had never opened
// /settings — falsy, so this whole span was skipped. And the one value that did
// arrive on first render ('miles', lowercase) matched no branch of
// roundDistance, so it formatted as "undefined miles away".
describe('NearbyShopRow distance label', () => {
  test('renders a real distance for the default unit', () => {
    render(<NearbyShopRow shop={makeShop()} distance="1.23456" units={DEFAULT_UNITS} />)

    const label = screen.getByText(/away$/)
    expect(label.textContent).toBe('1.23 miles away')
  })

  test('renders a real distance for meters', () => {
    render(<NearbyShopRow shop={makeShop()} distance="1234.56" units="Meters" />)
    expect(screen.getByText('1235 meters away')).toBeTruthy()
  })

  test('never renders undefined or NaN for any valid unit', () => {
    for (const units of Object.values(DISTANCE_UNITS)) {
      const { unmount } = render(<NearbyShopRow shop={makeShop()} distance="500" units={units} />)
      expect(screen.getByText(/away$/).textContent).not.toMatch(/undefined|NaN/)
      unmount()
    }
  })
})
