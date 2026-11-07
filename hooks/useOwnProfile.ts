import { useEffect, useState } from 'react'

export interface Profile {
  user_id: string
  display_name: string | null
  avatar_url: string | null
  is_public: boolean
}

// Loads the signed-in user's own profile from /api/profiles. `profile` is null
// while loading, on error, or when the user has no profile row yet.
export function useOwnProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/profiles')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load profile: ${res.status}`)
        return res.json()
      })
      .then((data: Profile | null) => setProfile(data))
      .catch((err) => {
        console.error('Failed to load profile:', err)
        setError('Could not load your profile.')
      })
      .finally(() => setLoading(false))
  }, [])

  return { profile, setProfile, loading, error }
}
