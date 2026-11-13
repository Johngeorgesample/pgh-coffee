import { describe, test, vi } from 'vitest'
import { expectPng } from '../helpers/ogImage'

vi.mock('@/app/utils/companies', () => ({ getCompanyForSeo: vi.fn(), getCompanyShopPhotos: vi.fn() }))
vi.mock('@/app/utils/roasters', () => ({ getRoasterForSeo: vi.fn() }))

import CompanyImage from '@/app/(map)/companies/[slug]/opengraph-image'
import RoasterImage from '@/app/(map)/roasters/[slug]/opengraph-image'
import { getCompanyForSeo, getCompanyShopPhotos } from '@/app/utils/companies'
import { getRoasterForSeo } from '@/app/utils/roasters'

const params = Promise.resolve({ slug: 'any-slug' })

// Most roasters have no company to borrow a shop photo from; satori throws on a
// malformed layout, and a throwing OG route is a 500 the crawler caches.
describe('company and roaster opengraph-image', () => {
  test('renders a PNG for a roaster with no company', async () => {
    vi.mocked(getRoasterForSeo).mockResolvedValue({ name: 'Macizo', company_id: null })

    await expectPng(await RoasterImage({ params }))
  })

  test('renders a PNG for a company whose shops have no photos', async () => {
    vi.mocked(getCompanyForSeo).mockResolvedValue({ id: 'c1', name: "Rock 'n' Joe" })
    vi.mocked(getCompanyShopPhotos).mockResolvedValue([null])

    await expectPng(await CompanyImage({ params }))
  })

  test('renders a PNG when the slug matches nothing', async () => {
    vi.mocked(getRoasterForSeo).mockResolvedValue(null)
    vi.mocked(getCompanyForSeo).mockResolvedValue(null)

    await expectPng(await RoasterImage({ params }))
    await expectPng(await CompanyImage({ params }))
  })
})
