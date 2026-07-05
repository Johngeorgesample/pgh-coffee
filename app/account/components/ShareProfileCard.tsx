'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ShareLink from './ShareLink'

export default function ShareProfileCard() {
  const [profile, setProfile] = useState<{ user_id: string; is_public: boolean } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/profiles')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading || !profile) return null

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 space-y-3">
      <div>
        <p className="text-sm font-medium text-gray-700">Share your profile</p>
        <p className="text-sm text-gray-500">
          {profile.is_public
            ? 'Anyone with this link can see your stats and passport.'
            : 'Make your profile public in Settings to get a shareable link.'}
        </p>
      </div>
      {profile.is_public ? (
        <ShareLink url={`${window.location.origin}/u/${profile.user_id}`} />
      ) : (
        <Link
          href="/account/settings"
          className="inline-block rounded-lg py-2 px-4 text-sm font-semibold text-black bg-yellow-300 hover:bg-yellow-400"
        >
          Go to Settings
        </Link>
      )}
    </div>
  )
}
