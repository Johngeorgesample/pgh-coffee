import { describe, test, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ShopCard, { roundDistance, generateDistanceText } from '@/app/components/ShopCard'
import type { TShop } from '@/types/shop-types'

const handleShopSelectMock = vi.fn()
const setHoveredShopMock = vi.fn()

vi.mock('@/hooks', () => ({
  useShopSelection: () => ({ handleShopSelect: handleShopSelectMock }),
}))

vi.mock('@/stores/coffeeShopsStore', () => ({
  __esModule: true,
  default: () => ({
    setHoveredShop: setHoveredShopMock,
  }),
}))

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
      company: null,
      name: 'Test Shop',
      neighborhood: 'Downtown',
      address: '456 Murray Ave, Pittsburgh, PA 15217',
      photo: 'https://uljutxoijtvtcxvatqso.supabase.co/storage/v1/object/public/shop-photos/test.jpg',
      website: 'https://testshop.com',
      uuid: '1234'
    },
    geometry: {
      type: 'Point',
      coordinates: [-79.925, 40.4363],
    },
  }

  const defaultProps = {
    shop: mockShop,
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
    // @ts-expect-error
    render(<ShopCard {...defaultProps} distance="1.23456" units="Miles" />)

    expect(screen.getByText('1.23 miles away')).toBeTruthy()
  })

  it('does not render distance when distance or units are missing', () => {
    const { rerender } = render(<ShopCard {...defaultProps} />)
    expect(screen.queryByText(/away/)).toBeNull()

    rerender(<ShopCard {...defaultProps} distance="1.23" />)
    expect(screen.queryByText(/away/)).toBeNull()

    // @ts-expect-error
    rerender(<ShopCard {...defaultProps} units="Miles" />)
    expect(screen.queryByText(/away/)).toBeNull()
  })

  it('sets background image when photo is provided', () => {
    render(<ShopCard {...defaultProps} />)
    expect(screen.getByRole('img')).toBeTruthy()
  })

  it('does not set background image when photo is missing', () => {
    const shopWithoutPhoto = {
      ...mockShop,
      properties: { ...mockShop.properties, photo: undefined },
    }
    render(<ShopCard {...defaultProps} shop={shopWithoutPhoto} />)
    const bgElement = screen.getByRole('button').querySelector('.bg-yellow-200 bg-cover') as HTMLElement
    expect(bgElement?.style.backgroundImage).toBe(undefined)
  })

  it('calls handleShopSelect when Enter key is pressed', () => {
    render(<ShopCard {...defaultProps} />)
    const keyEvent = { key: 'Enter' }
    fireEvent.keyDown(screen.getByRole('button'), keyEvent)
    expect(handleShopSelectMock).toHaveBeenCalledWith(mockShop)
  })

  it('has correct accessibility attributes', () => {
    render(<ShopCard {...defaultProps} />)
    const card = screen.getByRole('button')
    expect(card.getAttribute('tabIndex')).toBe('0')
    expect(card.getAttribute('role')).toBe('button')
  })
})
