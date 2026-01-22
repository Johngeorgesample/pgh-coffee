'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AuthForm from '@/app/components/AuthForm'

export default function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [urlError, setUrlError] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam === 'auth_failed') {
      setUrlError('Authentication failed. Please try again.')
    }
  }, [searchParams])

  const handleSuccess = () => {
    router.push('/')
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {urlError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 mb-4">
          {urlError}
        </div>
      )}
      <AuthForm onSuccess={handleSuccess} />
    </div>
  )
}
