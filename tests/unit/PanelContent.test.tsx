import { render, screen } from '@testing-library/react'
import { describe, vi } from 'vitest'
import PanelContent, { getGoogleMapsUrl } from '@/app/components/PanelContent'
import type { TShop } from '@/types/shop-types'

describe('getGoogleMapsUrl', () => {
  it('returns correct Google Maps URL with given coordinates', () => {
    const coordinates = {
      latitude: 40.4363,
      longitude: -79.925,
    }

    const expectedUrl = 'https://www.google.com/maps?q=-79.925,40.4363'
    const result = getGoogleMapsUrl(coordinates)

    expect(result).toBe(expectedUrl)
  })
})

describe('PanelContent', () => {
  const mockShop: TShop = {
    type: 'shop',
    properties: {
      name: 'Test Shop',
      neighborhood: 'Downtown',
      address: '456 Murray Ave, Pittsburgh, PA 15217',
      photo: 'https://example.com/photo.jpg',
      website: 'https://testshop.com',
      uuid: '1234'
    },
    geometry: {
      type: 'Point',
      coordinates: [-79.925, 40.4363],
    },
  }

  const mockHandleNearbyShopClick = vi.fn()

  const defaultProps = {
    shop: mockShop,
    handleNearbyShopClick: mockHandleNearbyShopClick,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders shop name and neighborhood', () => {
    render(<PanelContent {...defaultProps} />)

    expect(screen.getByText(mockShop.properties.name)).toBeTruthy()
    expect(screen.getByText(mockShop.properties.neighborhood)).toBeTruthy()
  })

  it('renders the shop address', () => {
    render(<PanelContent {...defaultProps} />)

    const { container } = render(<PanelContent {...defaultProps} />)
    const addressElement = container.querySelector('address')
    expect(addressElement).toBeInTheDocument()
    expect(addressElement).toHaveTextContent(mockShop.properties.address)
  })

  it('renders link to website when provided URL', () => {
    render(<PanelContent {...defaultProps} />)

    expect(screen.getByText(mockShop.properties.website)).toBeTruthy()
  })
})
