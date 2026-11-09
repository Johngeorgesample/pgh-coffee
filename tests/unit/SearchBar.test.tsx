import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from '@/app/components/SearchBar'

// Mock the shops store for searchValue/setSearchValue
const mockUseShopsStore = vi.fn()
vi.mock('@/stores/coffeeShopsStore', () => ({
  __esModule: true,
  default: (selector?: (s: unknown) => unknown) => {
    const state = mockUseShopsStore()
    return selector ? selector(state) : state
  },
}))

// Mock the panel store for panelMode and back()
const mockUsePanelStore = vi.fn()
vi.mock('@/stores/panelStore', () => ({
  __esModule: true,
  default: Object.assign(
    (selector?: (s: unknown) => unknown) => {
      const state = mockUsePanelStore()
      return selector ? selector(state) : state
    },
    { getState: () => ({ back: vi.fn() }) },
  ),
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
      screen.getByPlaceholderText('Search shops, roasters, or neighborhoods')
    ).toBeInTheDocument()
  })

  it('updates the store when the user types (drives filtering upstream)', () => {
    render(<SearchBar />)
    const input = screen.getByPlaceholderText('Search shops, roasters, or neighborhoods')

    fireEvent.change(input, { target: { value: 'Lawrenceville' } })
    expect(defaultShopsState.setSearchValue).toHaveBeenCalledWith('Lawrenceville')
  })

  it('offers a clear action for a populated search', () => {
    mockUseShopsStore.mockReturnValue({ ...defaultShopsState, searchValue: 'Lawrenceville' })
    render(<SearchBar />)

    expect(screen.getByRole('textbox')).toHaveClass('text-base')
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(defaultShopsState.setSearchValue).toHaveBeenCalledWith('')
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
      screen.getByPlaceholderText('Search shops, roasters, or neighborhoods')
    ).toHaveValue('Ineffable Cà Phê')
  })

})

describe('SearchBar near me', () => {
  beforeEach(() => window.history.replaceState({}, '', '/?near=me'))

  it('re-fits the map instead of navigating when already showing shops near me', () => {
    const point: [number, number] = [-80.0021, 40.4417]
    const setNearPoint = vi.fn()
    mockUseShopsStore.mockReturnValue({ searchValue: '', setSearchValue: vi.fn(), nearPoint: point, setNearPoint })
    mockUsePanelStore.mockReturnValue({ panelMode: 'near' })
    render(<SearchBar />)

    const notPrevented = fireEvent.click(screen.getByLabelText('Shops near me'))

    expect(notPrevented).toBe(false)
    expect(setNearPoint).toHaveBeenCalledWith(point)
    expect(setNearPoint.mock.calls[0][0]).not.toBe(point)
  })
})
