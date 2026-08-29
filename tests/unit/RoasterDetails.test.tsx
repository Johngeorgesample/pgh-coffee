import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { RoasterDetails } from '@/app/components/RoasterDetails'

vi.mock('@/app/components/LocationList', () => ({
  default: () => <div data-testid="location-list" />,
}))

vi.mock('@/stores/coffeeShopsStore', () => ({
  default: (selector: (state: unknown) => unknown) => selector({ setOverrideShops: vi.fn() }),
}))

const plausible = vi.hoisted(() => vi.fn())
vi.mock('@/hooks', () => ({ useAnalytics: () => plausible }))

const roaster = (overrides = {}) => ({
  id: 'roaster-1',
  name: 'Allegheny Coffee Roasters',
  slug: 'allegheny-coffee-roasters',
  company_id: null,
  logo: null,
  website: null,
  instagram: null,
  description: null,
  is_verified: false,
  shops: [],
  ...overrides,
})

describe('RoasterDetails', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('renders the roaster and offers a claim when it is unverified', async () => {
    ;(fetch as any).mockResolvedValueOnce({ ok: true, status: 200, json: async () => roaster() })

    render(<RoasterDetails slug="allegheny-coffee-roasters" />)

    await waitFor(() =>
      expect(screen.getByText('Allegheny Coffee Roasters')).toBeInTheDocument(),
    )
    expect(screen.getByText('Claim this roaster')).toBeInTheDocument()
  })

  test('does not render a claimable empty roaster when the API 500s', async () => {
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Error fetching roaster shops' }),
    })

    render(<RoasterDetails slug="allegheny-coffee-roasters" />)

    await waitFor(() =>
      expect(screen.getByText(/Couldn't load this roaster/)).toBeInTheDocument(),
    )
    expect(screen.queryByText('Claim this roaster')).not.toBeInTheDocument()
  })

  test('reports a missing roaster as not found rather than as a failure', async () => {
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: 'Roaster not found' }),
    })

    render(<RoasterDetails slug="nope" />)

    await waitFor(() => expect(screen.getByText('Roaster not found')).toBeInTheDocument())
    expect(screen.queryByText('Claim this roaster')).not.toBeInTheDocument()
  })

  test('clears the previous roaster on slug change, before the new fetch settles', async () => {
    ;(fetch as any).mockResolvedValueOnce({ ok: true, status: 200, json: async () => roaster() })

    const { rerender } = render(<RoasterDetails slug="allegheny-coffee-roasters" />)
    await waitFor(() =>
      expect(screen.getByText('Allegheny Coffee Roasters')).toBeInTheDocument(),
    )

    ;(fetch as any).mockImplementationOnce(() => new Promise(() => {}))
    rerender(<RoasterDetails slug="de-fer-roasting" />)

    expect(screen.queryByText('Allegheny Coffee Roasters')).not.toBeInTheDocument()
  })

  test('ignores a stale response that resolves after the slug already changed', async () => {
    let resolveFirst: (value: unknown) => void = () => {}
    ;(fetch as any).mockImplementationOnce(
      () => new Promise(resolve => { resolveFirst = resolve }),
    )

    const { rerender } = render(<RoasterDetails slug="allegheny-coffee-roasters" />)
    await waitFor(() => expect(fetch).toHaveBeenCalled())

    ;(fetch as any).mockImplementationOnce(() => new Promise(() => {}))
    rerender(<RoasterDetails slug="de-fer-roasting" />)

    resolveFirst({ ok: true, status: 200, json: async () => roaster() })
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(screen.queryByText('Allegheny Coffee Roasters')).not.toBeInTheDocument()
  })
})
