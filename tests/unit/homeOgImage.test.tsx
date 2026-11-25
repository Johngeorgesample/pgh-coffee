import { describe, test, vi } from 'vitest'
import { expectPng } from '../helpers/ogImage'

vi.mock('@/app/utils/seo', () => ({
  getAllShopsForSeo: vi.fn().mockResolvedValue([
    { name: 'Commonplace', neighborhood: 'Mexican War Streets', latitude: 40.456, longitude: -80.011 },
    { name: 'No Coordinates', neighborhood: 'Downtown', latitude: null, longitude: null },
  ]),
}))

import Image from '@/app/opengraph-image'

describe('home opengraph-image', () => {
  test('renders a PNG', async () => {
    await expectPng(await Image())
  })
})
