import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ShopList from '@/app/components/ShopList'
import type { TShop } from '@/types/shop-types'

vi.mock('@/hooks', () => ({
  useShopSelection: () => ({ handleShopSelect: vi.fn() }),
}))

vi.mock('@/stores/coffeeShopsStore', () => ({
  __esModule: true,
  default: () => ({
    setHoveredShop: vi.fn(),
  }),
}))

const mockShops: TShop[] = [
  {
    type: 'Feature',
    properties: {
      company: null,
      name: 'Coffee & Tea Shop',
      neighborhood: 'Downtown',
      address: '123 Main St',
      website: 'https://example.com',
      uuid: '1',
    },
    geometry: {
      type: 'Point',
      coordinates: [-79.925, 40.4363],
    },
  },
  {
    type: 'Feature',
    properties: {
      company: null,
      name: 'Café Elegance',
      neighborhood: 'North Oakland',
      address: '456 Fifth Ave',
      website: 'https://example2.com',
      uuid: '2',
    },
    geometry: {
      type: 'Point',
      coordinates: [-79.926, 40.4364],
    },
  },
  {
    type: 'Feature',
    properties: {
      company: null,
      name: 'Downtown Roasters',
      neighborhood: 'Shadyside',
      address: '789 Walnut St',
      website: 'https://example3.com',
      uuid: '3',
    },
    geometry: {
      type: 'Point',
      coordinates: [-79.927, 40.4365],
    },
  },
]

describe('ShopList', () => {
  test('renders all shops passed to it', () => {
    render(<ShopList coffeeShops={mockShops} />)
    expect(screen.getByText('Coffee & Tea Shop')).toBeTruthy()
    expect(screen.getByText('Café Elegance')).toBeTruthy()
    expect(screen.getByText('Downtown Roasters')).toBeTruthy()
  })

  test('renders empty list when no shops are provided', () => {
    render(<ShopList coffeeShops={[]} />)
    expect(screen.queryByRole('listitem')).toBeNull()
  })
})
