import { render, screen, fireEvent } from '@testing-library/react'
import Panel from '@/app/components/Panel'
import { TShop } from '@/types/shop-types'

beforeAll(() => {
  globalThis.matchMedia =
    globalThis.matchMedia ||
    function () {
      return {
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
      }
    }
})

describe('Panel Component', () => {
  const mockShop: TShop = {
    type: 'Feature',
    properties: {
      name: 'Test Shop',
      neighborhood: 'Lower Lawrenceville',
      address: '123 Test St.',
      photo: '',
      website: '',
    },
    geometry: {
      type: 'Point',
      coordinates: [-79.9253955, 40.4855015],
    },
  }

  const mockEmitClose = vi.fn()
  const mockHandlePanelContentClick = vi.fn()

  const defaultProps = {
    children: <div>Panel Content</div>,
    shop: mockShop,
    panelIsOpen: true,
    emitClose: mockEmitClose,
    handlePanelContentClick: mockHandlePanelContentClick,
  }

  it('renders the panel content', () => {
    render(<Panel {...defaultProps} />)
    expect(screen.getByText('Panel Content')).toBeInTheDocument()
  })

  it('supports interactions with child content', () => {
    render(
      <Panel {...defaultProps}>
        <button onClick={() => mockHandlePanelContentClick(mockShop)}>Click Me</button>
      </Panel>,
    )

    const button = screen.getByText('Click Me')
    fireEvent.click(button)

    expect(mockHandlePanelContentClick).toHaveBeenCalledWith(mockShop)
  })
})
