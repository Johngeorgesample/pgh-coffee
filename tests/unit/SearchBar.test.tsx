import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from '@/app/components/SearchBar'

// Mock the store hook to control searchValue/panelMode
const mockUsePanelStore = vi.fn()
vi.mock('@/stores/panelStore', () => ({
  __esModule: true,
  default: () => mockUsePanelStore(),
  // If you end up calling usePanelStore.getState().back() in the component,
  // you can also expose a static getState on the mock like below:
  default: Object.assign(() => mockUsePanelStore(), {
    getState: () => ({ back: vi.fn() }),
  }),
}))

describe('SearchBar', () => {
  const mockOnClose = vi.fn()

  const defaultStoreState = {
    searchValue: '',
    setSearchValue: vi.fn(),
    panelMode: 'explore',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUsePanelStore.mockReturnValue(defaultStoreState)
  })

  it('renders search input with placeholder text', () => {
    render(<SearchBar onClose={mockOnClose} />)
    expect(
      screen.getByPlaceholderText('Search for a shop or neighborhood')
    ).toBeInTheDocument()
  })

  it('updates the store when the user types (drives filtering upstream)', () => {
    render(<SearchBar onClose={mockOnClose} />)
    const input = screen.getByPlaceholderText('Search for a shop or neighborhood')

    fireEvent.change(input, { target: { value: 'Lawrenceville' } })
    expect(defaultStoreState.setSearchValue).toHaveBeenCalledWith('Lawrenceville')
  })

  it('reflects the current store value in the input (controlled)', () => {
    const { rerender } = render(<SearchBar onClose={mockOnClose} />)
    // Simulate store changing outside the component by returning a new value
    mockUsePanelStore.mockReturnValue({
      ...defaultStoreState,
      searchValue: 'Ineffable Cà Phê',
    })
    rerender(<SearchBar onClose={mockOnClose} />)

    expect(
      screen.getByPlaceholderText('Search for a shop or neighborhood')
    ).toHaveValue('Ineffable Cà Phê')
  })

})
