import { describe, test, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/app/utils/companies', () => ({
  getCompanyBySlug: async () => ({ id: 'company-1' }),
}))

vi.mock('@supabase/supabase-js', () => {
  const shop = { name: 'Commonplace', is_verified: false, company: { is_verified: true } }
  const builder: Record<string, unknown> = {
    select: () => builder,
    eq: () => builder,
    then: (resolve: (value: unknown) => unknown) =>
      Promise.resolve({ data: [{ id: 'event-1', shop }], error: null }).then(resolve),
  }
  return { createClient: () => ({ from: () => builder }) }
})

describe('Company events API Route - GET', () => {
  test('marks shops verified via their owning company', async () => {
    const { GET } = await import('@/app/api/companies/[company]/events/route')
    const response = await GET(new NextRequest('http://localhost:3000/api/companies/commonplace/events'), {
      params: Promise.resolve({ company: 'commonplace' }),
    })
    const [event] = await response.json()
    expect(event.shop.is_verified).toBe(true)
  })
})
