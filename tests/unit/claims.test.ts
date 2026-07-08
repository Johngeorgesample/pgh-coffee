import { describe, test, expect, vi, beforeEach } from 'vitest'

// resolveClaimTarget routes a `/claim` entry to the entity a claim should target
// and rolls company-owned shops/roasters up to their company. Mock the leaf
// lookups so these tests exercise the routing/roll-up logic, not the queries.
import { resolveClaimTarget } from '@/app/utils/claims'
import { getShopByUuidPrefix } from '@/app/utils/shops'
import { getCompanyBySlug } from '@/app/utils/companies'
import { getRoasterBySlug } from '@/app/utils/roasters'

vi.mock('@/app/utils/shops', () => ({ getShopByUuidPrefix: vi.fn() }))
vi.mock('@/app/utils/companies', () => ({ getCompanyBySlug: vi.fn() }))
vi.mock('@/app/utils/roasters', () => ({ getRoasterBySlug: vi.fn() }))

// companyTarget counts a company's shops and roaster directly through supabase.
// A chainable stub returns a per-table result so the coverage counts resolve.
let shopCountResult: { count: number | null; error: unknown }
let companyRoasterResult: { data: unknown[] | null; error: unknown }
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: (table: string) => {
      const result = () => (table === 'shops' ? shopCountResult : companyRoasterResult)
      const chain = {
        select: () => chain,
        eq: () => chain,
        limit: () => chain,
        then: (resolve: (v: unknown) => void) => resolve(result()),
      }
      return chain
    },
  }),
}))

const mockShop = vi.mocked(getShopByUuidPrefix)
const mockCompany = vi.mocked(getCompanyBySlug)
const mockRoaster = vi.mocked(getRoasterBySlug)

const UUID = '11111111-1111-1111-1111-111111111111'

describe('resolveClaimTarget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    shopCountResult = { count: 0, error: null }
    companyRoasterResult = { data: [], error: null }
  })

  test('returns null when no entry param is given', async () => {
    expect(await resolveClaimTarget({})).toBeNull()
  })

  test('rejects a malformed shop prefix without hitting the shop lookup', async () => {
    expect(await resolveClaimTarget({ shop: 'not-a-uuid' })).toBeNull()
    expect(mockShop).not.toHaveBeenCalled()
  })

  test('resolves a standalone shop to a shop target', async () => {
    mockShop.mockResolvedValueOnce({
      uuid: UUID,
      name: 'Commonplace',
      neighborhood: 'Squirrel Hill',
      photo: 'photo.jpg',
      company: null,
    } as any)

    expect(await resolveClaimTarget({ shop: UUID })).toEqual({
      type: 'shop',
      id: UUID,
      name: 'Commonplace',
      subtitle: 'Squirrel Hill',
      photo: 'photo.jpg',
    })
  })

  test('rolls a company-owned shop up to its company', async () => {
    mockShop.mockResolvedValueOnce({
      uuid: UUID,
      name: 'Commonplace',
      company: { id: 'company-1', name: 'Commonplace Coffee' },
    } as any)
    shopCountResult = { count: 4, error: null }
    companyRoasterResult = { data: [{ id: 'r1' }], error: null }

    expect(await resolveClaimTarget({ shop: UUID })).toEqual({
      type: 'company',
      id: 'company-1',
      name: 'Commonplace Coffee',
      locationCount: 4,
      hasRoaster: true,
    })
  })

  test('returns null when the shop is not found', async () => {
    mockShop.mockResolvedValueOnce(null)
    expect(await resolveClaimTarget({ shop: UUID })).toBeNull()
  })

  test('resolves a standalone roaster to a roaster target', async () => {
    mockRoaster.mockResolvedValueOnce({
      id: 'roaster-1',
      name: 'Allegheny Coffee',
      company_id: null,
      company: null,
    } as any)

    expect(await resolveClaimTarget({ roaster: 'allegheny' })).toEqual({
      type: 'roaster',
      id: 'roaster-1',
      name: 'Allegheny Coffee',
    })
  })

  test('rolls a company-owned roaster up to its company', async () => {
    mockRoaster.mockResolvedValueOnce({
      id: 'roaster-1',
      name: 'In-House Roaster',
      company_id: 'company-1',
      company: { id: 'company-1', name: 'Commonplace Coffee' },
    } as any)
    shopCountResult = { count: 2, error: null }

    const result = await resolveClaimTarget({ roaster: 'in-house' })
    expect(result).toMatchObject({ type: 'company', id: 'company-1', name: 'Commonplace Coffee' })
  })

  test('resolves a company slug to a company target with coverage counts', async () => {
    mockCompany.mockResolvedValueOnce({ id: 'company-1', name: 'Commonplace Coffee' } as any)
    shopCountResult = { count: 3, error: null }
    companyRoasterResult = { data: [{ id: 'r1' }], error: null }

    expect(await resolveClaimTarget({ company: 'commonplace' })).toEqual({
      type: 'company',
      id: 'company-1',
      name: 'Commonplace Coffee',
      locationCount: 3,
      hasRoaster: true,
    })
  })

  test('returns null when the company is not found', async () => {
    mockCompany.mockResolvedValueOnce(null)
    expect(await resolveClaimTarget({ company: 'nope' })).toBeNull()
  })

  test('throws rather than reporting misleading coverage when a count query fails', async () => {
    mockCompany.mockResolvedValueOnce({ id: 'company-1', name: 'Commonplace Coffee' } as any)
    shopCountResult = { count: null, error: { message: 'boom' } }

    await expect(resolveClaimTarget({ company: 'commonplace' })).rejects.toThrow(/count company shops/)
  })
})
