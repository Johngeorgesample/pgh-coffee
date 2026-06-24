'use client'

import { useEffect, useRef, useState } from 'react'
import { useAnalytics } from '@/hooks'
import { Photo } from '@/types/shop-types'

const BUCKET_URL = 'https://uljutxoijtvtcxvatqso.supabase.co/storage/v1/object/public/shop-photos'

const DRAG_THRESHOLD = 5 // px before a mouse drag counts as a scroll (not a click)

interface PhotoGridProps {
  photos: Photo[]
}

const getPhotoUrl = (photo: Photo | string) =>
  typeof photo === 'string' ? photo : `${BUCKET_URL}/${photo.path}`

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const plausible = useAnalytics()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  // Mouse drag-to-scroll. Touch keeps native momentum scrolling, so we only
  // intercept mouse pointers. `dragged` suppresses the expand-click that would
  // otherwise fire at the end of a drag.
  const drag = useRef({ active: false, startX: 0, startScroll: 0, dragged: false })

  useEffect(() => {
    setExpandedIndex(null)
  }, [photos])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !scrollRef.current) return
    drag.current = { active: true, startX: e.clientX, startScroll: scrollRef.current.scrollLeft, dragged: false }
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active || !scrollRef.current) return
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) > DRAG_THRESHOLD) {
      drag.current.dragged = true
      scrollRef.current.setPointerCapture(e.pointerId)
    }
    scrollRef.current.scrollLeft = drag.current.startScroll - dx
  }

  const onPointerUp = () => {
    drag.current.active = false
  }

  const handleImageClick = (index: number) => {
    // Swallow the click that ends a drag so dragging doesn't toggle expansion.
    if (drag.current.dragged) {
      drag.current.dragged = false
      return
    }

    const isExpanding = expandedIndex !== index

    plausible('PhotoGridClick', {
      props: {
        photoUrl: getPhotoUrl(photos[index]),
        action: isExpanding ? 'expand' : 'collapse',
      },
    })

    setExpandedIndex(isExpanding ? index : null)
  }

  if (!photos.length) return null

  return (
    <section className="px-4 sm:px-6 py-5 border-b border-stone-200">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Photos</p>
      {/* p-1 keeps the focus/selection ring from being clipped by the scroll
          container; the arbitrary properties hide the scrollbar across browsers. */}
      <div
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="flex items-start gap-2 overflow-x-auto p-1 cursor-grab select-none active:cursor-grabbing [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo, index) => (
          <button
            key={index}
            onClick={() => handleImageClick(index)}
            className={`shrink-0 overflow-hidden rounded-lg transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              expandedIndex === index ? 'h-52 w-72 ring-2 ring-amber-500' : 'h-28 w-36'
            }`}
            aria-label={`Toggle coffee shop photo ${index + 1}`}
            aria-pressed={expandedIndex === index}
          >
            <img
              src={getPhotoUrl(photo)}
              alt={`Coffee shop photo ${index + 1}`}
              draggable={false}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </section>
  )
}
