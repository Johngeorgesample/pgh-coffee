import { Suspense } from 'react'
import SignInForm from './SignInForm'

export default function SignIn() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sign in</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to your pgh.coffee account</p>
        </div>
        <Suspense fallback={<div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse h-96" />}>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  )
}
