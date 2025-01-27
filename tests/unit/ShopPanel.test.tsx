import { render, screen, fireEvent } from '@testing-library/react'
import ShopPanel from '@/app/components/ShopPanel'
import { TShop } from '@/types/shop-types'


beforeAll(() => {
  globalThis.matchMedia = globalThis.matchMedia || function() {
    return {
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
    }
  }
})

describe('ShopPanel Component', () => {
  const mockShop: TShop = {
  "type": "Feature",
  "properties": {
    "name": "Test Shop",
    "neighborhood": "Lower Lawrenceville",
    "address": "123 Test St.",
    "photo": "",
    "website": ""
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-79.9253955, 40.4855015]
  }
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

  it('renders the panel content when open', () => {
    render(<ShopPanel {...defaultProps} />)
    expect(screen.getByText('Panel Content')).toBeInTheDocument()
  })

  it('does not render the panel content when closed', () => {
    render(<ShopPanel {...defaultProps} panelIsOpen={false} />)
    expect(screen.queryByText('Panel Content')).not.toBeInTheDocument()
  })

  it('calls emitClose when the dialog is closed', () => {
    render(<ShopPanel {...defaultProps} />)

    const dialog = screen.getByRole('dialog')
    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' })

    expect(mockEmitClose).toHaveBeenCalled()
  })

  it('applies correct animation based on screen size', () => {
    window.matchMedia = vi.fn().mockImplementation(query => {
      return {
        matches: query === '(min-width: 1024px)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }
    })

    render(<ShopPanel {...defaultProps} />)

    expect(screen.getByText('Panel Content')).toBeInTheDocument()
  })

  it('supports interactions with child content', () => {
    render(
      <ShopPanel {...defaultProps}>
        <button onClick={() => mockHandlePanelContentClick(mockShop)}>Click Me</button>
      </ShopPanel>
    )

    const button = screen.getByText('Click Me')
    fireEvent.click(button)

    expect(mockHandlePanelContentClick).toHaveBeenCalledWith(mockShop)
  })
})
