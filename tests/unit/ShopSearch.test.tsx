import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ShopSearch from '@/app/components/ShopSearch'

const noEntities = { roasters: [], companies: [] }
let mockState = { searchValue: '', features: [] as unknown[], allShops: undefined as unknown[] | undefined, entities: noEntities as Record<string, unknown[]>, closed: [] as string[] }
vi.mock('@/stores/coffeeShopsStore', () => ({
  __esModule: true,
  default: (selector: (s: unknown) => unknown) => selector({ ...mockState, allShops: { features: mockState.allShops ?? mockState.features } }),
  useDisplayedShops: () => ({ features: mockState.features }),
  useIsClosed: () => (uuid: string) => mockState.closed.includes(uuid),
}))
vi.mock('@/app/components/ShopList', () => ({
  default: ({ coffeeShops, isClosed }: { coffeeShops: { properties: { uuid: string } }[]; isClosed: (uuid: string) => boolean }) => (
    <ul>
      {coffeeShops.map(({ properties: { uuid } }) => (
        <li key={uuid}>{isClosed(uuid) ? `${uuid} (closed)` : uuid}</li>
      ))}
    </ul>
  ),
}))
vi.mock('@/app/components/EntitySearchResults', () => ({ default: () => null }))
vi.mock('@/hooks/useMatchedEntities', () => ({ useMatchedEntities: () => mockState.entities }))
vi.mock('next/dynamic', () => ({ default: () => () => null }))

describe('ShopSearch', () => {
  it('explains an empty result for a search', () => {
    mockState = { searchValue: 'zzz', features: [], allShops: undefined, entities: noEntities, closed: [] }
    render(<ShopSearch />)
    expect(screen.getByText(/Nothing matches/)).toHaveTextContent('zzz')
  })

  it('stays quiet before the user types', () => {
    mockState = { searchValue: '', features: [], allShops: undefined, entities: noEntities, closed: [] }
    render(<ShopSearch />)
    expect(screen.queryByText(/Nothing matches/)).toBeNull()
  })

  it('does not call a search empty when only a roaster matches', () => {
    mockState = { searchValue: 'la prima', features: [], allShops: undefined, entities: { roasters: [{ name: 'La Prima', slug: 'la-prima' }], companies: [] }, closed: [] }
    render(<ShopSearch />)
    expect(screen.queryByText(/Nothing matches/)).toBeNull()
  })

  it('does not call a search empty when a neighborhood matches', () => {
    const squirrelHill = [{ properties: { name: 'Commonplace', neighborhood: 'Squirrel Hill North' } }]
    mockState = { searchValue: 'squi', features: [], allShops: squirrelHill, entities: noEntities, closed: [] }
    render(<ShopSearch />)
    expect(screen.queryByText(/Nothing matches/)).toBeNull()
  })

  it('keeps closed shops in the list, after the open ones', () => {
    const shop = (uuid: string) => ({ properties: { uuid } })
    mockState = { searchValue: '', features: [shop('a'), shop('b'), shop('c')], allShops: undefined, entities: noEntities, closed: ['a'] }
    render(<ShopSearch />)
    expect(screen.getAllByRole('listitem').map(li => li.textContent)).toEqual(['b', 'c', 'a (closed)'])
  })
})
