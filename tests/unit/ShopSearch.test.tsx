import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ShopSearch from '@/app/components/ShopSearch'

let mockState = { searchValue: '', features: [] as unknown[] }
vi.mock('@/stores/coffeeShopsStore', () => ({
  __esModule: true,
  default: (selector: (s: unknown) => unknown) => selector(mockState),
  useDisplayedShops: () => ({ features: mockState.features }),
}))
vi.mock('@/app/components/ShopList', () => ({ default: () => null }))
vi.mock('next/dynamic', () => ({ default: () => () => null }))

describe('ShopSearch', () => {
  it('explains an empty result for a search', () => {
    mockState = { searchValue: 'zzz', features: [] }
    render(<ShopSearch />)
    expect(screen.getByText(/No shops match/)).toHaveTextContent('zzz')
  })

  it('stays quiet before the user types', () => {
    mockState = { searchValue: '', features: [] }
    render(<ShopSearch />)
    expect(screen.queryByText(/No shops match/)).toBeNull()
  })
})
