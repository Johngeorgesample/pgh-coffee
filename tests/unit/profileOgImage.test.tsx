import { describe, test, vi } from 'vitest'
import type { Visit } from '@/app/utils/visitStats'
import type { DbShop } from '@/types/shop-types'
import { expectPng } from '../helpers/ogImage'

vi.mock('@/app/utils/profiles', () => ({ getPublicProfile: vi.fn() }))
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({ select: () => Promise.resolve({ data: [{ neighborhood: 'Bloomfield' }], error: null }) }),
  }),
}))

import Image from '@/app/u/[id]/opengraph-image'
import { getPublicProfile } from '@/app/utils/profiles'

const mockProfile = vi.mocked(getPublicProfile)

const params = Promise.resolve({ id: 'any-id' })

describe('profile opengraph-image', () => {
  test('renders a PNG for a known public profile', async () => {
    const visit: Visit = { id: 'v1', created_at: '2024-01-01', shop: { neighborhood: 'Bloomfield' } as DbShop }
    mockProfile.mockResolvedValue({ displayName: 'Coffee Lover', avatarUrl: null, visits: [visit] })

    await expectPng(await Image({ params }))
  })

  test('renders a PNG when the id matches no public profile', async () => {
    mockProfile.mockResolvedValue(null)

    await expectPng(await Image({ params }))
  })
})
