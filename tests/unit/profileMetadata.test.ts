import { describe, expect, test, vi } from 'vitest'
import { generateMetadata } from '@/app/u/[id]/page'
import { getPublicProfile } from '@/app/utils/profiles'
import type { Visit } from '@/app/utils/visitStats'

vi.mock('@/app/utils/profiles', () => ({ getPublicProfile: vi.fn() }))

const visit = (id: string, neighborhood: string) =>
  ({ id, created_at: '2026-01-01', shop: { neighborhood } }) as unknown as Visit

const params = Promise.resolve({ id: '00000000-0000-0000-0000-000000000000' })

describe('profile generateMetadata', () => {
  test('builds share metadata from visit stats, without a twitter object', async () => {
    vi.mocked(getPublicProfile).mockResolvedValueOnce({
      displayName: 'Ada',
      avatarUrl: null,
      visits: [visit('1', 'Bloomfield'), visit('2', 'Bloomfield'), visit('3', 'Shadyside')],
    })

    const metadata = await generateMetadata({ params })

    expect(metadata.title).toBe('Ada · pgh.coffee')
    expect(metadata.description).toBe(
      'Ada has visited 3 independent Pittsburgh coffee shops across 2 neighborhoods. Track your own coffee passport on pgh.coffee.',
    )
    expect(metadata.openGraph).toMatchObject({ siteName: 'pgh.coffee', title: 'Ada · pgh.coffee' })
    // No twitter object: the layout's { card: 'summary_large_image' } must be
    // inherited so X falls back to og:* and this route's opengraph-image.
    expect(metadata.twitter).toBeUndefined()
  })

  test('singularizes counts for a single visit', async () => {
    vi.mocked(getPublicProfile).mockResolvedValueOnce({
      displayName: null,
      avatarUrl: null,
      visits: [visit('1', 'Bloomfield')],
    })

    const metadata = await generateMetadata({ params })

    expect(metadata.description).toContain('Coffee lover has visited 1 independent Pittsburgh coffee shop across 1 neighborhood.')
  })
})
