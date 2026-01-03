import { render, screen, fireEvent } from '@testing-library/react'
import Panel from '@/app/components/Panel'
import { TShop } from '@/types/shop-types'

// Mock the Silk components
vi.mock('@silk-hq/components', () => ({
  Sheet: {
    Root: ({ children, presented }: any) => presented ? <div data-testid="sheet-root">{children}</div> : null,
    Portal: ({ children }: any) => <div data-testid="sheet-portal">{children}</div>,
    View: ({ children }: any) => <div data-testid="sheet-view">{children}</div>,
    Backdrop: () => <div data-testid="sheet-backdrop" />,
    Content: ({ children, ref }: any) => <div data-testid="sheet-content" ref={ref}>{children}</div>,
    Handle: ({ children }: any) => <div data-testid="sheet-handle">{children}</div>,
    BleedingBackground: () => <div data-testid="sheet-bleeding-background" />,
  },
  useClientMediaQuery: vi.fn(() => true), // Mock as large viewport by default
}))

// Mock the shop store
vi.mock('@/stores/coffeeShopsStore', () => ({
  default: vi.fn(() => ({
    currentShop: {
      type: 'Feature',
      properties: {
        company: null,
        name: 'Test Shop',
        neighborhood: 'Lower Lawrenceville',
        address: '123 Test St.',
        photo: '',
        website: '',
        uuid: '1234',
      },
      geometry: {
        type: 'Point',
        coordinates: [-79.9253955, 40.4855015],
      },
    }
  }))
}))

// Mock SearchBar component
vi.mock('@/app/components/SearchBar', () => ({
  default: ({ onClose }: any) => <div data-testid="search-bar">Search Bar</div>
}))

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
      company: null,
      name: 'Test Shop',
      neighborhood: 'Lower Lawrenceville',
      address: '123 Test St.',
      photo: '',
      website: '',
      uuid: '1234',
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
