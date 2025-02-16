import { render, screen } from '@testing-library/react'
import { describe, test } from 'vitest'
import { usePlausible } from 'next-plausible'
import PanelHeader from '@/app/components/PanelHeader'

vi.mock('next-plausible', () => ({
  usePlausible: vi.fn(),
}))

describe.skip('PanelHeader', () => {
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

  beforeEach(() => {
    vi.clearAllMocks()
    ;(usePlausible as vi.Mock).mockReturnValue(mockPlausible)
  })

  it('renders shop photo in a dialog when clicked', () => {
    const plausibleMock = usePlausible()
    render(<PanelHeader shop={mockShop} />)

    const panelHeader = screen.getByTestId('header')
    panelHeader.click()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('logs event with Plausible when backgroundImage is clicked', () => {
    const plausibleMock = usePlausible()
    render(<PanelHeader shop={mockShop} />)

    const panelHeader = screen.getByTestId('header')
    panelHeader.click()

    expect(plausibleMock).toHaveBeenCalledWith('PanelHeaderClick', {
      props: {
        shopName: mockShop.properties.name,
        neighborhood: mockShop.properties.neighborhood,
      },
    })
  })
})
