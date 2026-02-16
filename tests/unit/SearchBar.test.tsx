import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from '@/app/components/SearchBar'

// Mock the shops store for searchValue/setSearchValue
const mockUseShopsStore = vi.fn()
vi.mock('@/stores/coffeeShopsStore', () => ({
  __esModule: true,
  default: () => mockUseShopsStore(),
}))

// Mock the panel store for panelMode and back()
const mockUsePanelStore = vi.fn()
vi.mock('@/stores/panelStore', () => ({
  __esModule: true,
  default: Object.assign(() => mockUsePanelStore(), {
    getState: () => ({ back: vi.fn() }),
  }),
}))

describe('SearchBar', () => {

  const defaultShopsState = {
    searchValue: '',
    setSearchValue: vi.fn(),
  }

  const defaultPanelState = {
    panelMode: 'explore',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseShopsStore.mockReturnValue(defaultShopsState)
    mockUsePanelStore.mockReturnValue(defaultPanelState)
  })

  it('renders search input with placeholder text', () => {
    render(<SearchBar />)
    expect(
      screen.getByPlaceholderText('Search for a shop or neighborhood')
    ).toBeInTheDocument()
  })

  it('updates the store when the user types (drives filtering upstream)', () => {
    render(<SearchBar />)
    const input = screen.getByPlaceholderText('Search for a shop or neighborhood')

    fireEvent.change(input, { target: { value: 'Lawrenceville' } })
    expect(defaultShopsState.setSearchValue).toHaveBeenCalledWith('Lawrenceville')
  })

  it('reflects the current store value in the input (controlled)', () => {
    const { rerender } = render(<SearchBar />)
    // Simulate store changing outside the component by returning a new value
    mockUseShopsStore.mockReturnValue({
      ...defaultShopsState,
      searchValue: 'Ineffable Cà Phê',
    })
    rerender(<SearchBar />)

    expect(
      screen.getByPlaceholderText('Search for a shop or neighborhood')
    ).toHaveValue('Ineffable Cà Phê')
  })

})
