'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useAnalytics } from '@/hooks'
import { useAuth } from './AuthProvider'
import ToggleToast from './ToggleToast'
import type { ToggleConfig } from './toggleConfigs'

const LoginPromptModal = dynamic(() => import('./LoginPromptModal'), { ssr: false })

interface ToggleButtonProps {
  shopUUID: string
  shopName: string
  config: ToggleConfig
}

export default function ToggleButton({ shopUUID, shopName, config }: ToggleButtonProps) {
  const { user, loading: authLoading } = useAuth()
  const plausible = useAnalytics()
  const [isActive, setIsActive] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) {
        setIsActive(false)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(config.apiPath)
        if (response.ok) {
          const entries = await response.json()
          setIsActive(entries.some((entry: { shop: { uuid: string } }) => entry.shop?.uuid === shopUUID))
        }
      } catch (error) {
        console.error(`Error checking ${config.noun} status:`, error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading) checkStatus()
  }, [shopUUID, user, authLoading, config.apiPath, config.noun])

  const handleToggle = async () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    setIsLoading(true)
    const wasAlreadyActive = isActive

    try {
      const method = isActive ? 'DELETE' : 'POST'
      const response = await fetch(config.apiPath, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopUUID }),
      })

      if (response.ok) {
        const newState = !isActive
        setIsActive(newState)
        plausible(config.analyticsEvent, { props: { shopName, shopUUID, status: newState } })
        if (!wasAlreadyActive) {
          setShowToast(true)
          setJustAdded(true)
        }
      }
    } catch (error) {
      console.error(`Error toggling ${config.noun}:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  const { Icon } = config

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={isLoading}
        aria-label={isActive ? config.ariaLabelActive : config.ariaLabelInactive}
        aria-pressed={isActive}
        title={isActive ? config.ariaLabelActive : config.ariaLabelInactive}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 transition ease-out active:scale-95 disabled:opacity-50"
      >
        <Icon
          onAnimationEnd={() => setJustAdded(false)}
          className={`size-[18px] transition-colors ${isActive ? config.activeIconClassName : ''} ${justAdded ? 'animate-pop motion-reduce:animate-none' : ''}`}
        />
      </button>

      <ToggleToast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        shopName={shopName}
        Icon={config.Icon}
        iconClassName={[config.activeIconClassName, config.toast.extraIconClassName].filter(Boolean).join(' ')}
        config={config.toast}
      />
      {showLoginModal && <LoginPromptModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />}
    </>
  )
}
