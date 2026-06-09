'use client'

import { useEffect, useReducer } from 'react'
import dynamic from 'next/dynamic'
import { Heart } from 'lucide-react'
import { useAnalytics } from '@/hooks'
import FavoriteToast from './FavoriteToast'
import { useAuth } from './AuthProvider'

const LoginPromptModal = dynamic(() => import('./LoginPromptModal'), { ssr: false })

const fetchFavorites = async (): Promise<{ shop: { uuid: string } }[]> => {
  const response = await fetch('/api/favorites')
  if (!response.ok) throw new Error('Failed to fetch favorites')
  return response.json()
}

interface FavoriteButtonProps {
  shopUUID: string
  shopName: string
}

interface FavoriteRecord {
  shop: { uuid: string }
}

interface State {
  favorites: FavoriteRecord[] | null
  fetching: boolean
  showToast: boolean
  showLoginModal: boolean
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; favorites: FavoriteRecord[] }
  | { type: 'FETCH_ERROR' }
  | { type: 'TOGGLE_LOCAL'; shopUUID: string }
  | { type: 'SHOW_TOAST' }
  | { type: 'HIDE_TOAST' }
  | { type: 'SHOW_LOGIN_MODAL' }
  | { type: 'HIDE_LOGIN_MODAL' }

const initialState: State = {
  favorites: null,
  fetching: false,
  showToast: false,
  showLoginModal: false,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, fetching: true }
    case 'FETCH_SUCCESS':
      return { ...state, fetching: false, favorites: action.favorites }
    case 'FETCH_ERROR':
      return { ...state, fetching: false }
    case 'TOGGLE_LOCAL': {
      const prev = state.favorites ?? []
      const isFav = prev.some(f => f.shop?.uuid === action.shopUUID)
      const next = isFav
        ? prev.filter(f => f.shop?.uuid !== action.shopUUID)
        : [...prev, { shop: { uuid: action.shopUUID } }]
      return { ...state, favorites: next }
    }
    case 'SHOW_TOAST':
      return { ...state, showToast: true }
    case 'HIDE_TOAST':
      return { ...state, showToast: false }
    case 'SHOW_LOGIN_MODAL':
      return { ...state, showLoginModal: true }
    case 'HIDE_LOGIN_MODAL':
      return { ...state, showLoginModal: false }
    default:
      return state
  }
}

export default function FavoriteButton({ shopUUID, shopName }: FavoriteButtonProps) {
  const { user, loading: authLoading } = useAuth()
  const plausible = useAnalytics()
  const [state, dispatch] = useReducer(reducer, initialState)

  const isLoading = authLoading || state.fetching
  const isFavorited =
    !!user && (state.favorites?.some(fav => fav.shop?.uuid === shopUUID) ?? false)

  useEffect(() => {
    if (authLoading || !user) return

    let cancelled = false
    dispatch({ type: 'FETCH_START' })
    fetchFavorites()
      .then((data) => {
        if (!cancelled) dispatch({ type: 'FETCH_SUCCESS', favorites: data })
      })
      .catch((error) => {
        console.error('Error checking favorite status:', error)
        if (!cancelled) dispatch({ type: 'FETCH_ERROR' })
      })

    return () => {
      cancelled = true
    }
  }, [user, authLoading])

  const handleToggle = async () => {
    if (!user) {
      dispatch({ type: 'SHOW_LOGIN_MODAL' })
      return
    }

    const wasAlreadyFavorited = isFavorited

    try {
      const method = isFavorited ? 'DELETE' : 'POST'
      const response = await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopUUID }),
      })

      if (response.ok) {
        dispatch({ type: 'TOGGLE_LOCAL', shopUUID })
        plausible('favorite', {
          props: { shopName, shopUUID, status: !wasAlreadyFavorited },
        })
        if (!wasAlreadyFavorited) {
          dispatch({ type: 'SHOW_TOAST' })
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-800 px-4 py-2.5 rounded-3xl text-sm font-medium border border-stone-200 transition-colors disabled:opacity-50"
      >
        <Heart className={`size-4 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
        {isFavorited ? 'Favorited' : 'Favorite'}
      </button>

      <FavoriteToast
        isOpen={state.showToast}
        onClose={() => dispatch({ type: 'HIDE_TOAST' })}
        shopName={shopName}
      />
      {state.showLoginModal && (
        <LoginPromptModal
          isOpen={state.showLoginModal}
          onClose={() => dispatch({ type: 'HIDE_LOGIN_MODAL' })}
        />
      )}
    </>
  )
}
