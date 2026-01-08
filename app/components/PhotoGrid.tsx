'use client'

import { useEffect, useState } from 'react'
import { Photo } from '@/types/shop-types'

const BUCKET_URL = 'https://uljutxoijtvtcxvatqso.supabase.co/storage/v1/object/public/shop-photos'

interface PhotoGridProps {
  photos: Photo[]
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  useEffect(() => {
    setExpandedIndex(null)
  }, [photos])

  const handleImageClick = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const getPhotoUrl = (photo: Photo | string): string => {
    if (typeof photo === 'string') {
      return photo
    }
    return `${BUCKET_URL}/${photo.path}`
  }

  return (
    <section className="flex flex-col mt-4 px-4 sm:px-6">
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, index) => (
          <button
            key={index}
            onClick={() => handleImageClick(index)}
            className={`
              relative overflow-hidden rounded-lg transition-all duration-300
              ${expandedIndex === index ? 'col-span-3 aspect-[4/3]' : 'aspect-square'}
              hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
            `}
            aria-label={`Toggle photo expansion for coffee shop photo ${index + 1}`}
            aria-pressed={expandedIndex === index}
          >
            <img
              src={getPhotoUrl(photo)}
              alt={`Coffee shop photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </section>
  )
}
