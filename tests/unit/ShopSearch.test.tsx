import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ShopSearch from '@/app/components/ShopSearch'

const noEntities = { roasters: [], companies: [] }
let mockState = { searchValue: '', features: [] as unknown[], entities: noEntities as Record<string, unknown[]> }
vi.mock('@/stores/coffeeShopsStore', () => ({
  __esModule: true,
  default: (selector: (s: unknown) => unknown) => selector(mockState),
  useDisplayedShops: () => ({ features: mockState.features }),
}))
vi.mock('@/app/components/ShopList', () => ({ default: () => null }))
vi.mock('@/app/components/EntitySearchResults', () => ({
  default: () => null,
  useMatchedEntities: () => mockState.entities,
}))
vi.mock('next/dynamic', () => ({ default: () => () => null }))

describe('ShopSearch', () => {
  it('explains an empty result for a search', () => {
    mockState = { searchValue: 'zzz', features: [], entities: noEntities }
    render(<ShopSearch />)
    expect(screen.getByText(/Nothing matches/)).toHaveTextContent('zzz')
  })

  it('stays quiet before the user types', () => {
    mockState = { searchValue: '', features: [], entities: noEntities }
    render(<ShopSearch />)
    expect(screen.queryByText(/Nothing matches/)).toBeNull()
  })

  it('does not call a search empty when only a roaster matches', () => {
    mockState = { searchValue: 'la prima', features: [], entities: { roasters: [{ name: 'La Prima', slug: 'la-prima' }], companies: [] } }
    render(<ShopSearch />)
    expect(screen.queryByText(/Nothing matches/)).toBeNull()
  })
})
