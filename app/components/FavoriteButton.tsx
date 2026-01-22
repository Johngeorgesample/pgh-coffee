'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { usePlausible } from 'next-plausible'
import FavoriteToast from './FavoriteToast'
import LoginPromptModal from './LoginPromptModal'
import { useAuth } from './AuthProvider'

interface FavoriteButtonProps {
  shopUUID: string
  shopName: string
}

export default function FavoriteButton({ shopUUID, shopName }: FavoriteButtonProps) {
  const { user, loading: authLoading } = useAuth()
  const plausible = usePlausible()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/favorites')
        if (response.ok) {
          const favorites = await response.json()
          const isFav = favorites.some((fav: { shop: { uuid: string } }) => fav.shop?.uuid === shopUUID)
          setIsFavorited(isFav)
          plausible('favorite', {
            props: {
              shopName,
              shopUUID,
              status: isFav
            },
          })
        }
      } catch (error) {
        console.error('Error checking favorite status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading) {
      checkFavoriteStatus()
    }
  }, [shopUUID, user, authLoading])

  const handleToggle = async () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    setIsLoading(true)
    const wasAlreadyFavorited = isFavorited

    try {
      const method = isFavorited ? 'DELETE' : 'POST'
      const response = await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopUUID }),
      })

      if (response.ok) {
        setIsFavorited(!isFavorited)
        if (!wasAlreadyFavorited) {
          setShowToast(true)
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-800 px-4 py-2.5 rounded-3xl text-sm font-medium border border-stone-200 transition-colors disabled:opacity-50"
      >
        <Heart className={`w-4 h-4 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
        {isFavorited ? 'Favorited' : 'Favorite'}
      </button>

      <FavoriteToast isOpen={showToast} onClose={() => setShowToast(false)} shopName={shopName} />
      <LoginPromptModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}
