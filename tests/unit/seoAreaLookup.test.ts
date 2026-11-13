import { describe, test, expect, vi } from 'vitest'

vi.mock('@supabase/supabase-js', () => ({ createClient: () => ({}) }))
vi.mock('@/lib/logger', () => ({ logger: { error: vi.fn() } }))
vi.mock('@/lib/supabase/server-client', () => ({
  getClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({ order: async () => ({ data: null, error: { message: 'connection refused' } }) }),
      }),
    }),
  }),
}))

import { getAreaBySlug } from '@/app/utils/seo'

describe('getAreaBySlug', () => {
  test('fails loudly instead of reporting a real area as missing when the query errors', async () => {
    await expect(getAreaBySlug('lawrenceville')).rejects.toThrow('connection refused')
  })
})
