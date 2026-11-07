import { describe, test, vi } from 'vitest'
import { expectPng } from '../helpers/ogImage'

vi.mock('@/app/utils/updates', () => ({ getUpdateForSeo: vi.fn() }))

import Image from '@/app/(map)/news/[slug]/opengraph-image'
import { getUpdateForSeo } from '@/app/utils/updates'

const mockUpdate = vi.mocked(getUpdateForSeo)

const params = Promise.resolve({ slug: 'any-slug-00000000' })

// Many updates have no image and no shop; satori throws on a malformed layout,
// and a throwing OG route is a 500 the crawler caches.
describe('news opengraph-image', () => {
  test('renders a PNG for an update with no image or shop', async () => {
    mockUpdate.mockResolvedValue({ id: '00000000-0000-0000-0000-000000000000', title: 'Now open', tags: ['opening'] })

    await expectPng(await Image({ params }))
  })

  test('renders a PNG when the slug matches no update', async () => {
    mockUpdate.mockResolvedValue(null)

    await expectPng(await Image({ params }))
  })
})
