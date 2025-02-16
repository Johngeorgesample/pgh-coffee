import { render, screen } from '@testing-library/react'
import NearbyShops from '@/app/components/NearbyShops'
import { usePlausible } from 'next-plausible'
import useShopsStore from '@/stores/coffeeShopsStore'
import { TShop } from '@/types/shop-types'
import { describe, it, beforeEach, expect, vi } from 'vitest'

vi.mock('next-plausible', () => ({
  usePlausible: vi.fn(),
}))

vi.mock('@/stores/coffeeShopsStore', () => ({
  __esModule: true,
  default: vi.fn(),
}))

describe('NearbyShops', () => {
  const mockHandleClick = vi.fn()
  const mockPlausible = vi.fn()
  const mockShop: TShop = {
    type: 'shop',
    properties: {
      name: 'Test Shop',
      neighborhood: 'Squirrel Hill South',
      address: '456 Murray Ave, Pittsburgh, PA 15217',
      photo: 'https://example.com/photo.jpg',
      website: 'https://testshop.com',
    },
    geometry: {
      type: 'Point',
      coordinates: [-79.925, 40.4363],
    },
  }

  const mockCoffeeShops = {
    features: [
      {
        type: 'shop',
        properties: {
          name: 'Nearby Coffee Shop',
          neighborhood: 'Squirrel Hill South',
          address: '123 Another St, Pittsburgh, PA 15217',
          photo: 'https://example.com/photo2.jpg',
          website: 'https://nearbycoffeeshop.com',
        },
        geometry: {
          type: 'Point',
          coordinates: [-79.9255, 40.436],
        },
      },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useShopsStore as vi.Mock).mockReturnValue({ coffeeShops: mockCoffeeShops })
    ;(usePlausible as vi.Mock).mockReturnValue(mockPlausible)
  })

  it('renders nearby shops correctly', () => {
    render(<NearbyShops handleClick={mockHandleClick} shop={mockShop} />)

    expect(screen.getByText(/Nearby Coffee Shop/i)).toBeInTheDocument()
    expect(screen.getByText(/Squirrel Hill South/i)).toBeInTheDocument()
  })

  it('calls handleClick when a shop card is clicked', () => {
    render(<NearbyShops handleClick={mockHandleClick} shop={mockShop} />)

    const shopCard = screen.getByText(/Nearby Coffee Shop/i)
    shopCard.click()

    expect(mockHandleClick).toHaveBeenCalledWith(mockCoffeeShops.features[0])
  })

  it('logs event with Plausible when a shop card is clicked', () => {
    const plausibleMock = usePlausible()
    render(<NearbyShops handleClick={mockHandleClick} shop={mockShop} />)

    const shopCard = screen.getByText(/Nearby Coffee Shop/i)
    shopCard.click()

    expect(plausibleMock).toHaveBeenCalledWith('NearbyCardClick', {
      props: {
        shopName: mockCoffeeShops.features[0].properties.name,
        neighborhood: mockCoffeeShops.features[0].properties.neighborhood,
      },
    })
  })
})
