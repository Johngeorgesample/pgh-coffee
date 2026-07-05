'use client'

import { useEffect } from 'react'
import { useAnalytics } from '@/hooks'

export default function ProfileViewTracker({ profileId }: { profileId: string }) {
  const plausible = useAnalytics()

  useEffect(() => {
    plausible('ProfileView', { props: { profileId } })
  }, [plausible, profileId])

  return null
}
