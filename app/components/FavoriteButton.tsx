'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

interface FavoriteButtonProps {
  shopUUID: string
}

export default function FavoriteButton({ shopUUID }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch('/api/favorites')
        if (response.ok) {
          const favorites = await response.json()
          const isFav = favorites.some(
            (fav: { shop: { id: string } }) => fav.shop?.id === shopUUID
          )
          setIsFavorited(isFav)
        }
      } catch (error) {
        console.error('Error checking favorite status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkFavoriteStatus()
  }, [shopUUID])

  const handleToggle = async () => {
    setIsLoading(true)

    try {
      const method = isFavorited ? 'DELETE' : 'POST'
      const response = await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopUUID }),
      })

      if (response.ok) {
        setIsFavorited(!isFavorited)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-800 px-4 py-2.5 rounded-3xl text-sm font-medium border border-stone-200 transition-colors disabled:opacity-50"
    >
      <Heart
        className={`w-4 h-4 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : ''}`}
      />
      {isFavorited ? 'Favorited' : 'Favorite'}
    </button>
  )
}
