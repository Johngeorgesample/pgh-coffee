import { ImageResponse } from 'next/og'
import { getShopForSeo } from '@/app/utils/seo'
import { OG_IMAGE_SIZE, OG_CONTENT_TYPE } from '@/app/utils/ogTheme'
import { OgPhotoCard } from '@/app/utils/ogPhotoCard'

export const size = OG_IMAGE_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'pgh.coffee shop'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const shop = await getShopForSeo((await params).slug)

  return new ImageResponse(
    (
      <OgPhotoCard
        photo={shop?.photo ?? null}
        title={shop?.name ?? 'pgh.coffee'}
        subtitle={shop?.address ?? "Pittsburgh's independent coffee map"}
      />
    ),
    size,
  )
}
