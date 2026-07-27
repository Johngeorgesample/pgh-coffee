import { describe, expect, test, vi } from 'vitest'
import type { DbShop } from '@/types/shop-types'

vi.mock('@/app/utils/seo', () => ({ getShopForSeo: vi.fn() }))

import Image from '@/app/(map)/shops/[slug]/opengraph-image'
import { getShopForSeo } from '@/app/utils/seo'

const mockShop = vi.mocked(getShopForSeo)

const params = Promise.resolve({ slug: 'any-slug-00000000' })

// Every shop currently has a photo, so the photo-less and missing-shop branches
// can't be reached with real data — but satori throws on a malformed layout, and
// a throwing OG route is a 500 the crawler caches.
// The body has to be consumed: ImageResponse streams, so a layout satori can't
// render still returns a 200 whose stream throws on read.
const renderedBytes = async () => new Uint8Array(await (await Image({ params })).arrayBuffer())

const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47]

describe('shop opengraph-image', () => {
  test('renders a PNG for a shop with no photo', async () => {
    mockShop.mockResolvedValue({ name: '61B Cafe', address: '1108 S Braddock Ave', photo: null } as DbShop)

    expect([...(await renderedBytes()).slice(0, 4)]).toEqual(PNG_MAGIC)
  })

  test('renders a PNG when the slug matches no shop', async () => {
    mockShop.mockResolvedValue(null)

    expect([...(await renderedBytes()).slice(0, 4)]).toEqual(PNG_MAGIC)
  })
})
