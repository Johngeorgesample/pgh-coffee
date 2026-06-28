'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Stamp } from 'lucide-react'
import { useAnalytics } from '@/hooks'
import VisitedToast from './VisitedToast'
import { useAuth } from './AuthProvider'

const LoginPromptModal = dynamic(() => import('./LoginPromptModal'), { ssr: false })

interface VisitedButtonProps {
  shopUUID: string
  shopName: string
}

export default function VisitedButton({ shopUUID, shopName }: VisitedButtonProps) {
  const { user, loading: authLoading } = useAuth()
  const plausible = useAnalytics()
  const [isVisited, setIsVisited] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    const checkVisitedStatus = async () => {
      if (!user) {
        setIsVisited(false)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/visits')
        if (response.ok) {
          const visits = await response.json()
          const visited = visits.some((visit: { shop: { uuid: string } }) => visit.shop?.uuid === shopUUID)
          setIsVisited(visited)
        }
      } catch (error) {
        console.error('Error checking visited status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading) {
      checkVisitedStatus()
    }
  }, [shopUUID, user, authLoading])

  const handleToggle = async () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    setIsLoading(true)
    const wasAlreadyVisited = isVisited

    try {
      const method = isVisited ? 'DELETE' : 'POST'
      const response = await fetch('/api/visits', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopUUID }),
      })

      if (response.ok) {
        const newState = !isVisited
        setIsVisited(newState)
        plausible('visited', {
          props: { shopName, shopUUID, status: newState },
        })
        if (!wasAlreadyVisited) {
          setShowToast(true)
        }
      }
    } catch (error) {
      console.error('Error toggling visited:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={isLoading}
        aria-label={isVisited ? 'Visited' : 'Mark as visited'}
        aria-pressed={isVisited}
        title={isVisited ? 'Visited' : 'Mark as visited'}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 transition-colors disabled:opacity-50"
      >
        <Stamp className={`size-[18px] transition-colors ${isVisited ? 'fill-green-500 text-white' : ''}`} />
      </button>

      <VisitedToast isOpen={showToast} onClose={() => setShowToast(false)} shopName={shopName} />
      {showLoginModal && <LoginPromptModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />}
    </>
  )
}
