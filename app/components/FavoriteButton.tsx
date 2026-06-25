'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Heart } from 'lucide-react'
import { useAnalytics } from '@/hooks'
import FavoriteToast from './FavoriteToast'
import { useAuth } from './AuthProvider'

const LoginPromptModal = dynamic(() => import('./LoginPromptModal'), { ssr: false })

interface FavoriteButtonProps {
  shopUUID: string
  shopName: string
}

export default function FavoriteButton({ shopUUID, shopName }: FavoriteButtonProps) {
  const { user, loading: authLoading } = useAuth()
  const plausible = useAnalytics()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user) {
        setIsFavorited(false)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/favorites')
        if (response.ok) {
          const favorites = await response.json()
          const isFav = favorites.some((fav: { shop: { uuid: string } }) => fav.shop?.uuid === shopUUID)
          setIsFavorited(isFav)
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
        const newState = !isFavorited
        setIsFavorited(newState)
        plausible('favorite', {
          props: { shopName, shopUUID, status: newState },
        })
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
        aria-label={isFavorited ? 'Favorited' : 'Favorite'}
        aria-pressed={isFavorited}
        title={isFavorited ? 'Favorited' : 'Favorite'}
        className={`inline-flex flex-1 items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors disabled:opacity-50 ${
          isFavorited
            ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
            : 'bg-gray-950 hover:bg-gray-800 text-white'
        }`}
      >
        <Heart className={`h-4 w-4 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
        {isFavorited ? 'Favorited' : 'Favorite'}
      </button>

      <FavoriteToast isOpen={showToast} onClose={() => setShowToast(false)} shopName={shopName} />
      {showLoginModal && <LoginPromptModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />}
    </>
  )
}
