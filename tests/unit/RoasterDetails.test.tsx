import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RoasterDetails } from '@/app/components/RoasterDetails'

// Stable identity, like the real useCallback-wrapped hook — a fresh function per
// render would re-fire the fetch effect.
vi.mock('@/hooks', () => {
  const plausible = vi.fn()
  return { useAnalytics: () => plausible }
})

vi.mock('@/stores/coffeeShopsStore', () => ({
  default: () => vi.fn(),
}))

const roaster = (overrides: object) => ({
  id: 'roaster-1',
  name: 'Commonplace Coffee',
  slug: 'commonplace-coffee',
  company_id: null,
  logo: null,
  website: null,
  instagram: null,
  description: null,
  shops: [],
  ...overrides,
})

const renderRoaster = async (data: object) => {
  vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(data) } as Response)
  render(<RoasterDetails slug="commonplace-coffee" />)
  return screen.findByRole('heading', { name: /Commonplace Coffee/ })
}

const claimCTA = () => screen.queryByRole('link', { name: /claim this roaster/i })

describe('RoasterDetails claim CTA', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('offers the claim to an unverified, company-less roaster', async () => {
    await renderRoaster(roaster({}))

    expect(claimCTA()).toBeInTheDocument()
  })

  it('hides the claim once the roaster itself is verified', async () => {
    await renderRoaster(roaster({ is_verified: true }))

    expect(claimCTA()).not.toBeInTheDocument()
  })

  // A roaster's claim resolves to its company, so a verified company means the
  // claim is already done — offering it again sends the owner nowhere useful.
  it('hides the claim when the owning company is verified', async () => {
    await renderRoaster(
      roaster({
        company_id: 'company-1',
        is_verified: false,
        company: { name: 'Commonplace', slug: 'commonplace', is_verified: true },
      }),
    )

    expect(claimCTA()).not.toBeInTheDocument()
  })
})
