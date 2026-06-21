'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AuthForm from '@/app/components/AuthForm'

function SignInFormInner() {
  const { push, refresh } = useRouter()
  const searchParams = useSearchParams()
  const urlError = readError(searchParams)

  const handleSuccess = () => {
    push('/')
    refresh()
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

const readError = (params: URLSearchParams): string | null =>
  params.get('error') === 'auth_failed' ? 'Authentication failed. Please try again.' : null

export default function SignInForm() {
  return (
    <Suspense fallback={<div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse h-96" />}>
      <SignInFormInner />
    </Suspense>
  )
}
