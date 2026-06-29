'use client'

import { useEffect, useState } from 'react'
import { Check, Copy, ExternalLink } from 'lucide-react'

interface Profile {
  username: string | null
  display_name: string | null
  avatar_url: string | null
  is_public: boolean
}

export default function Settings() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/profiles')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load profile: ${res.status}`)
        return res.json()
      })
      .then((data: Profile | null) => {
        setProfile(data)
        setUsername(data?.username ?? '')
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load profile:', err)
        setError('Could not load your profile.')
        setLoading(false)
      })
  }, [])

  const save = async (updates: Partial<Profile>) => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/profiles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        return false
      }
      setProfile(data)
      setUsername(data.username ?? '')
      return true
    } catch (err) {
      console.error('Failed to save profile:', err)
      setError('Something went wrong.')
      return false
    } finally {
      setSaving(false)
    }
  }

  const handleSaveUsername = (e: React.FormEvent) => {
    e.preventDefault()
    save({ username })
  }

  const handleTogglePublic = () => {
    if (!profile) return
    save({ is_public: !profile.is_public })
  }

  if (loading) return <div>Loading...</div>

  const shareUrl =
    profile?.username && typeof window !== 'undefined'
      ? `${window.location.origin}/u/${profile.username}`
      : null

  const handleCopy = () => {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your public profile.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 space-y-6">
        <form onSubmit={handleSaveUsername} className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <p className="text-sm text-gray-500">
            3–30 characters: lowercase letters, numbers, or underscores. Your profile lives at{' '}
            <span className="font-mono">/u/{username || 'your-name'}</span>.
          </p>
          <div className="flex gap-2">
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your-name"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
            />
            <button
              type="submit"
              disabled={saving || username === (profile?.username ?? '')}
              className="rounded-lg py-2 px-4 text-sm font-semibold text-black bg-yellow-300 hover:bg-yellow-400 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </form>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Public profile</p>
              <p className="text-sm text-gray-500">
                {profile?.username
                  ? 'Anyone with the link can see your stats, passport, and public lists.'
                  : 'Choose a username first to make your profile public.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleTogglePublic}
              disabled={saving || !profile?.username}
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
            <div className="mt-4 flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
                {shareUrl}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 rounded-lg py-2 px-3 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg py-2 px-3 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <ExternalLink className="h-4 w-4" />
                View
              </a>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}
