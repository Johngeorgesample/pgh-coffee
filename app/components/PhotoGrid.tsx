'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useAnalytics } from '@/hooks'
import { Photo } from '@/types/shop-types'

const BUCKET_URL = 'https://uljutxoijtvtcxvatqso.supabase.co/storage/v1/object/public/shop-photos'

interface PhotoGridProps {
  photos: Photo[]
}

const getPhotoUrl = (photo: Photo | string) => {
  if (typeof photo === 'string') {
    return photo
  }
  return `${BUCKET_URL}/${photo.path}`
}

const getPhotoKey = (photo: Photo | string, index: number): string => {
  if (typeof photo === 'string') return photo
  return photo.path || String(index)
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const plausible = useAnalytics()
  const [expandedKey, setExpandedKey] = useState<string | null>(null)

  const handleImageClick = (key: string, photo: Photo | string) => {
    const isExpanding = expandedKey !== key

    plausible('PhotoGridClick', {
      props: {
        photoUrl: getPhotoUrl(photo),
        action: isExpanding ? 'expand' : 'collapse',
      },
    })

    setExpandedKey(isExpanding ? key : null)
  }

  return (
    <section className="flex flex-col mt-4 px-4 sm:px-6">
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, index) => {
          const key = getPhotoKey(photo, index)
          const isExpanded = expandedKey === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleImageClick(key, photo)}
              className={`
                relative overflow-hidden rounded-lg transition-all duration-300
                ${isExpanded ? 'col-span-3 aspect-[4/3]' : 'aspect-square'}
                hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
              `}
              aria-label={`Toggle expansion for coffee shop image ${index + 1}`}
              aria-pressed={isExpanded}
            >
              <Image
                src={getPhotoUrl(photo)}
                alt={`Coffee shop image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 33vw, 200px"
                className="object-cover"
                unoptimized
              />
            </button>
          )
        })}
      </div>
    </section>
  )
}
