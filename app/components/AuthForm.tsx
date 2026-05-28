'use client'

import { useReducer } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AuthFormProps {
  onSuccess: () => void
  idPrefix?: string
}

type AuthMode = 'signin' | 'signup'

interface AuthState {
  email: string
  password: string
  isLoading: boolean
  error: string | null
  mode: AuthMode
}

type AuthAction =
  | { type: 'SET_EMAIL'; value: string }
  | { type: 'SET_PASSWORD'; value: string }
  | { type: 'SET_LOADING'; value: boolean }
  | { type: 'SET_ERROR'; value: string | null }
  | { type: 'SET_MODE'; value: AuthMode }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_END' }

const initialAuthState: AuthState = {
  email: '',
  password: '',
  isLoading: false,
  error: null,
  mode: 'signin',
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.value }
    case 'SET_PASSWORD':
      return { ...state, password: action.value }
    case 'SET_LOADING':
      return { ...state, isLoading: action.value }
    case 'SET_ERROR':
      return { ...state, error: action.value }
    case 'SET_MODE':
      return { ...state, mode: action.value }
    case 'SUBMIT_START':
      return { ...state, isLoading: true, error: null }
    case 'SUBMIT_END':
      return { ...state, isLoading: false }
    default:
      return state
  }
}

export default function AuthForm({ onSuccess, idPrefix = '' }: AuthFormProps) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState)
  const { email, password, isLoading, error, mode } = state

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    dispatch({ type: 'SUBMIT_START' })

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          dispatch({ type: 'SET_ERROR', value: error.message })
          return
        }
        fetch('/api/auth/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'User signed in' }) })
        onSuccess()
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })

        if (error) {
          dispatch({ type: 'SET_ERROR', value: error.message })
          return
        }

        if (data.user?.identities?.length === 0) {
          dispatch({ type: 'SET_ERROR', value: 'An account with this email already exists. Please sign in instead.' })
          return
        }

        if (data.user && !data.session) {
          dispatch({ type: 'SET_ERROR', value: 'Please check your email to confirm your account before signing in.' })
          return
        }

        fetch('/api/auth/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'User signed up' }) })
        onSuccess()
      }
    } finally {
      dispatch({ type: 'SUBMIT_END' })
    }
  }

  const handleGoogleSignIn = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) dispatch({ type: 'SET_ERROR', value: error.message })
  }

  const emailId = idPrefix ? `${idPrefix}-email` : 'email'
  const passwordId = idPrefix ? `${idPrefix}-password` : 'password'

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-3 rounded-lg py-3 px-4 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        <svg className="size-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleEmailAuth} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">{error}</div>
        )}

        <div>
          <label htmlFor={emailId} className="block text-sm font-medium text-gray-900 mb-2">
            Email
          </label>
          <input
            id={emailId}
            type="email"
            aria-label="Email"
            value={email}
            onChange={(e) => dispatch({ type: 'SET_EMAIL', value: e.target.value })}
            required
            className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor={passwordId} className="block text-sm font-medium text-gray-900 mb-2">
            Password
          </label>
          <input
            id={passwordId}
            type="password"
            aria-label="Password"
            value={password}
            onChange={(e) => dispatch({ type: 'SET_PASSWORD', value: e.target.value })}
            required
            className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full rounded-lg py-3 px-4 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 ${
            isLoading ? 'bg-yellow-100 cursor-not-allowed' : 'bg-yellow-300 hover:bg-yellow-400'
          }`}
        >
          {isLoading ? 'Loading…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_MODE', value: mode === 'signin' ? 'signup' : 'signin' })}
          className="font-semibold text-yellow-600 hover:text-yellow-500"
        >
          {mode === 'signin' ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </>
  )
}
