'use client'

import { useState } from 'react'
import ShareLink from './ShareLink'
import AccountDetails from '../AccountDetails'
import { useOwnProfile } from '@/hooks'

export default function Settings() {
  const { profile, setProfile, loading, error: loadError } = useOwnProfile()
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleTogglePublic = async () => {
    if (!profile) return
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch('/api/profiles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_public: !profile.is_public }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSaveError(data.error ?? 'Something went wrong.')
        return
      }
      setProfile(data)
    } catch (err) {
      console.error('Failed to save profile:', err)
      setSaveError('Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading...</div>

  const shareUrl =
    profile?.user_id && typeof window !== 'undefined'
      ? `${window.location.origin}/u/${profile.user_id}`
      : null
  const error = saveError ?? loadError

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your public profile.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Public profile</p>
            <p className="text-sm text-gray-500">
              Anyone with the link can see your stats and passport.
            </p>
          </div>
          <button
            type="button"
            onClick={handleTogglePublic}
            disabled={saving}
            role="switch"
            aria-checked={profile?.is_public ?? false}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors disabled:opacity-50 ${
              profile?.is_public ? 'bg-yellow-400' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform mt-0.5 ${
                profile?.is_public ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {profile?.is_public && shareUrl && (
          <div className="mt-4">
            <ShareLink url={shareUrl} />
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>

      <AccountDetails />
    </div>
  )
}
