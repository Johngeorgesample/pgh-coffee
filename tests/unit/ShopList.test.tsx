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
      neighborhood: 'Oakland',
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

describe('ShopList search with synonyms', () => {
  test('renders all shops when no filter is provided', () => {
    render(<ShopList coffeeShops={mockShops} />)
    expect(screen.getByText('Coffee & Tea Shop')).toBeTruthy()
    expect(screen.getByText('Café Elegance')).toBeTruthy()
    expect(screen.getByText('Downtown Roasters')).toBeTruthy()
  })

  test('filters shops by exact name match', () => {
    render(<ShopList coffeeShops={mockShops} filter="elegance" />)
    expect(screen.queryByText('Coffee & Tea Shop')).toBeNull()
    expect(screen.getByText('Café Elegance')).toBeTruthy()
    expect(screen.queryByText('Downtown Roasters')).toBeNull()
  })

  test('filters shops by neighborhood', () => {
    render(<ShopList coffeeShops={mockShops} filter="oakland" />)
    expect(screen.queryByText('Coffee & Tea Shop')).toBeNull()
    expect(screen.getByText('Café Elegance')).toBeTruthy()
    expect(screen.queryByText('Downtown Roasters')).toBeNull()
  })

  test('matches "&" when searching for "and"', () => {
    render(<ShopList coffeeShops={mockShops} filter="and" />)
    expect(screen.getByText('Coffee & Tea Shop')).toBeTruthy()
    expect(screen.queryByText('Café Elegance')).toBeNull()
    expect(screen.queryByText('Downtown Roasters')).toBeNull()
  })

  test('matches "and" when searching for "&"', () => {
    render(<ShopList coffeeShops={mockShops} filter="&" />)
    expect(screen.getByText('Coffee & Tea Shop')).toBeTruthy()
    expect(screen.queryByText('Café Elegance')).toBeNull()
    expect(screen.queryByText('Downtown Roasters')).toBeNull()
  })

  test('matches "café" when searching for "cafe" (without accent)', () => {
    render(<ShopList coffeeShops={mockShops} filter="cafe" />)
    expect(screen.queryByText('Coffee & Tea Shop')).toBeNull()
    expect(screen.getByText('Café Elegance')).toBeTruthy()
    expect(screen.queryByText('Downtown Roasters')).toBeNull()
  })

  test('matches "cafe" when searching for "café" (with accent)', () => {
    render(<ShopList coffeeShops={mockShops} filter="café" />)
    expect(screen.queryByText('Coffee & Tea Shop')).toBeNull()
    expect(screen.getByText('Café Elegance')).toBeTruthy()
    expect(screen.queryByText('Downtown Roasters')).toBeNull()
  })

  test('handles multi-word searches', () => {
    render(<ShopList coffeeShops={mockShops} filter="downtown roasters" />)
    expect(screen.queryByText('Coffee & Tea Shop')).toBeNull()
    expect(screen.queryByText('Café Elegance')).toBeNull()
    expect(screen.getByText('Downtown Roasters')).toBeTruthy()
  })

  test('multi-word search with synonym', () => {
    render(<ShopList coffeeShops={mockShops} filter="coffee and tea" />)
    expect(screen.getByText('Coffee & Tea Shop')).toBeTruthy()
    expect(screen.queryByText('Café Elegance')).toBeNull()
    expect(screen.queryByText('Downtown Roasters')).toBeNull()
  })

  test('returns no results when filter does not match', () => {
    render(<ShopList coffeeShops={mockShops} filter="nonexistent" />)
    expect(screen.queryByText('Coffee & Tea Shop')).toBeNull()
    expect(screen.queryByText('Café Elegance')).toBeNull()
    expect(screen.queryByText('Downtown Roasters')).toBeNull()
  })

  test('is case-insensitive', () => {
    render(<ShopList coffeeShops={mockShops} filter="DOWNTOWN" />)
    expect(screen.getByText('Coffee & Tea Shop')).toBeTruthy()
  })
})
