import { ImageResponse } from 'next/og'
import { getUpdateForSeo } from '@/app/utils/updates'
import { OG_IMAGE_SIZE, OG_CONTENT_TYPE } from '@/app/utils/ogTheme'
import { OgPhotoCard } from '@/app/utils/ogPhotoCard'
import { getTagLabel } from '@/types/news-types'

export const size = OG_IMAGE_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'pgh.coffee update'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const update = await getUpdateForSeo((await params).slug)
  const subtitle = [getTagLabel(update?.tags?.[0] ?? undefined), update?.shop?.name].filter(Boolean).join(' · ')

  return new ImageResponse(
    (
      <OgPhotoCard
        photo={update?.image_url || update?.shop?.photo || null}
        title={update?.title ?? 'pgh.coffee'}
        subtitle={subtitle}
      />
    ),
    size,
  )
}
