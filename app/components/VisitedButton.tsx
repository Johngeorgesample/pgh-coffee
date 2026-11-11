'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Stamp } from 'lucide-react'
import { useAnalytics } from '@/hooks'
import VisitedToast from './VisitedToast'
import { useAuth } from './AuthProvider'
import useShopsStore from '@/stores/coffeeShopsStore'

const LoginPromptModal = dynamic(() => import('./LoginPromptModal'), { ssr: false })

interface VisitedButtonProps {
  shopUUID: string
  shopName: string
}

export default function VisitedButton({ shopUUID, shopName }: VisitedButtonProps) {
  const { user, loading: authLoading } = useAuth()
  const plausible = useAnalytics()
  const visitedUUIDs = useShopsStore(s => s.visitedUUIDs)
  const setVisited = useShopsStore(s => s.setVisited)
  const [isSaving, setIsSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const isVisited = !!visitedUUIDs?.has(shopUUID)
  const isLoading = isSaving || authLoading || (!!user && visitedUUIDs === null)

  const handleToggle = async () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    setIsSaving(true)
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
        setVisited(shopUUID, newState)
        plausible('visited', {
          props: { shopName, shopUUID, status: newState },
        })
        if (!wasAlreadyVisited) {
          setShowToast(true)
          setJustAdded(true)
        }
      }
    } catch (error) {
      console.error('Error toggling visited:', error)
    } finally {
      setIsSaving(false)
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
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 transition ease-out active:scale-95 disabled:opacity-50"
      >
        <Stamp
          onAnimationEnd={() => setJustAdded(false)}
          className={`size-[18px] transition-colors ${isVisited ? 'fill-green-500 text-white' : ''} ${justAdded ? 'animate-pop motion-reduce:animate-none' : ''}`}
        />
      </button>

      <VisitedToast isOpen={showToast} onClose={() => setShowToast(false)} shopName={shopName} />
      {showLoginModal && <LoginPromptModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />}
    </>
  )
}
