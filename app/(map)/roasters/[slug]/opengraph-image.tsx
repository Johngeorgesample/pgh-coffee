import { ImageResponse } from 'next/og'
import { getRoasterForSeo } from '@/app/utils/roasters'
import { getCompanyShopPhotos } from '@/app/utils/companies'
import { OG_IMAGE_SIZE, OG_CONTENT_TYPE } from '@/app/utils/ogTheme'
import { OgPhotoCard } from '@/app/utils/ogPhotoCard'

export const size = OG_IMAGE_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'pgh.coffee roaster'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const roaster = await getRoasterForSeo((await params).slug)
  // Only a roaster's own company's shops: a shop that merely serves the coffee isn't the roaster.
  const photos = roaster?.company_id ? await getCompanyShopPhotos(roaster.company_id) : []

  return new ImageResponse(
    <OgPhotoCard photo={photos.find(Boolean) ?? null} title={roaster?.name ?? 'pgh.coffee'} subtitle="Coffee roaster" />,
    size,
  )
}
