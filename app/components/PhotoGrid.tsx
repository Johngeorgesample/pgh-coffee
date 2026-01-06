'use client'

import { useState } from 'react'

const PLACEHOLDER_PHOTOS = [
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop',
]

export default function PhotoGrid() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const handleImageClick = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <section className="flex flex-col mt-4 px-4 sm:px-6">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Photos
      </p>

      <div className="grid grid-cols-3 gap-2">
        {PLACEHOLDER_PHOTOS.map((url, index) => (
          <button
            key={index}
            onClick={() => handleImageClick(index)}
            className={`
              relative overflow-hidden rounded-lg transition-all duration-300
              ${expandedIndex === index ? 'col-span-3 aspect-[4/3]' : 'aspect-square'}
              hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
            `}
          >
            <img
              src={url}
              alt={`Coffee shop photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </section>
  )
}
