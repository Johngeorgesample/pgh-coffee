import { ImageResponse } from 'next/og'
import { getCompanyForSeo, getCompanyShopPhotos } from '@/app/utils/companies'
import { OG_IMAGE_SIZE, OG_CONTENT_TYPE } from '@/app/utils/ogTheme'
import { OgPhotoCard } from '@/app/utils/ogPhotoCard'

export const size = OG_IMAGE_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'pgh.coffee company'

const locationCount = (n: number) => (n === 1 ? '1 location' : `${n} locations`)

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const company = await getCompanyForSeo((await params).slug)
  const photos = company ? await getCompanyShopPhotos(company.id) : []

  return new ImageResponse(
    (
      <OgPhotoCard
        photo={photos.find(Boolean) ?? null}
        title={company?.name ?? 'pgh.coffee'}
        subtitle={photos.length ? `Coffee company · ${locationCount(photos.length)}` : 'Coffee company'}
      />
    ),
    size,
  )
}
