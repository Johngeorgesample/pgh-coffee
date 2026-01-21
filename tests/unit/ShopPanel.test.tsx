import { render, screen, fireEvent } from '@testing-library/react'
import Panel from '@/app/components/Panel'
import { TShop } from '@/types/shop-types'

// Mock the MobileSheet component (dynamically imported)
vi.mock('@/app/components/MobileSheet', () => ({
  default: ({ children }: any) => <div data-testid="mobile-sheet">{children}</div>,
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
  // Mock as large viewport so the desktop Panel renders (no dynamic import)
  globalThis.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === '(min-width: 1024px)',
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    onchange: null,
    dispatchEvent: vi.fn(),
  }))
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
