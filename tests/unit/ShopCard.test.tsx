import { describe, test, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ShopCard, { roundDistance, generateDistanceText } from '@/app/components/ShopCard'
import type { TShop } from '@/types/shop-types'

describe('roundDistance', () => {
  it('rounds to 2 decimal places for Miles', () => {
    expect(roundDistance({ units: 'Miles', distance: 1.23456 })).toBe(1.23)
    expect(roundDistance({ units: 'Miles', distance: 5.678 })).toBe(5.68)
  })

  it('rounds to whole numbers for Meters', () => {
    expect(roundDistance({ units: 'Meters', distance: 1234.56 })).toBe(1235)
    expect(roundDistance({ units: 'Meters', distance: 567.89 })).toBe(568)
  })
})

describe('generateDistanceText', () => {
  it('formats distance with Miles correctly', () => {
    expect(generateDistanceText({ units: 'Miles', distance: '1.23456' })).toBe('1.23 miles away')
  })

  it('formats distance with Meters correctly', () => {
    expect(generateDistanceText({ units: 'Meters', distance: '1234.56' })).toBe('1235 meters away')
  })
})

describe('ShopCard', () => {
  const mockShop: TShop = {
    type: 'shop',
    properties: {
      name: 'Test Shop',
      neighborhood: 'Downtown',
      address: '456 Murray Ave, Pittsburgh, PA 15217',
      photo: 'test-photo-url.jpg',
      website: 'https://testshop.com',
    },
    geometry: {
      type: 'Point',
      coordinates: [-79.925, 40.4363],
    },
  }

  const mockHandleCardClick = vi.fn()
  const mockHandleKeyPress = vi.fn()

  const defaultProps = {
    shop: mockShop,
    handleCardClick: mockHandleCardClick,
    handleKeyPress: mockHandleKeyPress,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders shop name and neighborhood', () => {
    render(<ShopCard {...defaultProps} />)

    expect(screen.getByText('Test Shop')).toBeTruthy()
    expect(screen.getByText('Downtown')).toBeTruthy()
  })

  it('renders distance when distance and units are provided', () => {
    render(<ShopCard {...defaultProps} distance="1.23456" units="Miles" />)

    expect(screen.getByText('1.23 miles away')).toBeTruthy()
  })

  it('does not render distance when distance or units are missing', () => {
    const { rerender } = render(<ShopCard {...defaultProps} />)
    expect(screen.queryByText(/away/)).toBeNull()

    rerender(<ShopCard {...defaultProps} distance="1.23" />)
    expect(screen.queryByText(/away/)).toBeNull()

    rerender(<ShopCard {...defaultProps} units="Miles" />)
    expect(screen.queryByText(/away/)).toBeNull()
  })

  it('sets background image when photo is provided', () => {
    render(<ShopCard {...defaultProps} />)
    const imgElement = screen.getByRole('button').querySelector('.h-36') as HTMLElement
    expect(imgElement).toHaveAttribute('src', expect.stringContaining('test-photo-url.jpg'))
  })

  it('does not set background image when photo is missing', () => {
    const shopWithoutPhoto = {
      ...mockShop,
      properties: { ...mockShop.properties, photo: undefined },
    }
    render(<ShopCard {...defaultProps} shop={shopWithoutPhoto} />)
    const bgElement = screen.getByRole('button').querySelector('.h-36') as HTMLElement
    expect(bgElement?.style.backgroundImage).toBe('')
  })

  it('calls handleCardClick when clicked', () => {
    render(<ShopCard {...defaultProps} />)
    fireEvent.click(screen.getByRole('button'))
    expect(mockHandleCardClick).toHaveBeenCalledWith(mockShop)
  })

  it('calls handleKeyPress when key is pressed', () => {
    render(<ShopCard {...defaultProps} />)
    const keyEvent = { key: 'Enter' }
    fireEvent.keyDown(screen.getByRole('button'), keyEvent)
    expect(mockHandleKeyPress).toHaveBeenCalledWith(expect.any(Object), mockShop)
  })

  it('has correct accessibility attributes', () => {
    render(<ShopCard {...defaultProps} />)
    const card = screen.getByRole('button')
    expect(card.getAttribute('tabIndex')).toBe('0')
    expect(card.getAttribute('role')).toBe('button')
  })
})
