'use client'

import { useAuth } from '@/app/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { User } from 'lucide-react'

export default function AccountDetails() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <p className="text-gray-600 mb-4">You are not signed in.</p>
        <a
          href="/sign-in"
          className="inline-block rounded-lg py-3 px-4 text-sm font-semibold text-black bg-yellow-300 hover:bg-yellow-400"
        >
          Sign in
        </a>
      </div>
    )
  }

  const profilePicture = user?.user_metadata?.avatar_url

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
          {profilePicture ? <img className="rounded-full" src={profilePicture} alt={user.email || 'Profile picture'} /> : <User className="w-8 h-8 text-yellow-600" />}
        </div>
        <div>
          <p className="text-lg font-medium text-gray-900">{user.email}</p>
          <p className="text-sm text-gray-500">Joined {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p className="text-gray-900">{user.email}</p>
        </div>

        {user.user_metadata?.full_name && (
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-gray-900">{user.user_metadata.full_name}</p>
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-gray-500">User ID</p>
          <p className="text-gray-900 text-sm font-mono">{user.id}</p>
        </div>

        {user.app_metadata?.provider && (
          <div>
            <p className="text-sm font-medium text-gray-500">Sign-in method</p>
            <p className="text-gray-900 capitalize">{user.app_metadata.provider}</p>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 mt-6 pt-6">
        <button
          onClick={handleSignOut}
          className="w-full rounded-lg py-3 px-4 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
