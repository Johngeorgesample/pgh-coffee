import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Company } from '@/app/components/Company'

vi.mock('@/app/components/LocationList', () => ({
  default: () => <div data-testid="location-list" />,
}))

vi.mock('@/stores/coffeeShopsStore', () => ({
  default: (selector: (state: unknown) => unknown) =>
    selector({ setOverrideShops: vi.fn(), setSearchValue: vi.fn() }),
}))

vi.mock('@/hooks', () => ({ useAnalytics: () => vi.fn() }))

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))

const company = (overrides = {}) => ({
  id: 'company-1',
  name: 'Commonplace Coffee',
  slug: 'commonplace-coffee',
  is_verified: false,
  shops: [],
  ...overrides,
})

describe('Company', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('renders the company and offers a claim when it is unverified', async () => {
    ;(fetch as any).mockResolvedValueOnce({ ok: true, status: 200, json: async () => company() })

    render(<Company slug="commonplace-coffee" />)

    await waitFor(() => expect(screen.getByText('Commonplace Coffee')).toBeInTheDocument())
    expect(screen.getByText('Claim this brand')).toBeInTheDocument()
  })

  test('does not render a claimable empty company when the API 500s', async () => {
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Error fetching company shops' }),
    })

    render(<Company slug="commonplace-coffee" />)

    await waitFor(() =>
      expect(screen.getByText(/Couldn't load this company/)).toBeInTheDocument(),
    )
    expect(screen.queryByText('Claim this brand')).not.toBeInTheDocument()
    expect(screen.queryByText('0 locations')).not.toBeInTheDocument()
  })

  test('reports a missing company as not found rather than as a failure', async () => {
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: 'Company not found' }),
    })

    render(<Company slug="nope" />)

    await waitFor(() => expect(screen.getByText('Company not found')).toBeInTheDocument())
    expect(screen.queryByText('Claim this brand')).not.toBeInTheDocument()
  })

  test('survives a rejected fetch without leaving the panel on the skeleton', async () => {
    ;(fetch as any).mockRejectedValueOnce(new Error('network down'))

    render(<Company slug="commonplace-coffee" />)

    await waitFor(() =>
      expect(screen.getByText(/Couldn't load this company/)).toBeInTheDocument(),
    )
  })

  test('ignores a stale response that resolves after the slug already changed', async () => {
    let resolveFirst: (value: unknown) => void = () => {}
    ;(fetch as any).mockImplementationOnce(
      () => new Promise(resolve => { resolveFirst = resolve }),
    )

    const { rerender } = render(<Company slug="commonplace-coffee" />)
    await waitFor(() => expect(fetch).toHaveBeenCalled())

    ;(fetch as any).mockImplementationOnce(() => new Promise(() => {}))
    rerender(<Company slug="de-fer" />)

    resolveFirst({ ok: true, status: 200, json: async () => company() })
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(screen.queryByText('Commonplace Coffee')).not.toBeInTheDocument()
  })
})
