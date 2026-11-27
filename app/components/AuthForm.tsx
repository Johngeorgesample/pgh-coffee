'use client'

import { useState } from 'react'
import { Eye, EyeOff, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getFaro } from '@/lib/faro'

interface AuthFormProps {
  onSuccess: () => void
  idPrefix?: string
  next?: string
  initialMode?: 'signin' | 'signup'
  variant?: 'default' | 'advent'
  collapseEmail?: boolean
  googleLabel?: string
  expandedGoogleLabel?: string
  submitLabels?: { signin: string; signup: string }
  confirmDetail?: string
  onModeChange?: (mode: 'signin' | 'signup') => void
  onConfirmationSent?: () => void
}

const ADVENT_PRESS =
  'transition-[transform,box-shadow,background-color] duration-150 ease-out active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'

export default function AuthForm({
  onSuccess,
  idPrefix = '',
  next = '/',
  initialMode = 'signin',
  variant = 'default',
  collapseEmail = false,
  googleLabel = 'Continue with Google',
  expandedGoogleLabel = 'Continue with Google',
  submitLabels = { signin: 'Sign in', signup: 'Sign up' },
  confirmDetail,
  onModeChange,
  onConfirmationSent,
}: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailExpanded, setEmailExpanded] = useState(!collapseEmail)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [alreadyExists, setAlreadyExists] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [mode, setMode] = useState(initialMode)

  const isAdvent = variant === 'advent'
  const isCollapsed = collapseEmail && !emailExpanded

  const switchMode = (nextMode: 'signin' | 'signup') => {
    setMode(nextMode)
    setError(null)
    setAlreadyExists(false)
    setNotice(null)
    onModeChange?.(nextMode)
  }

  const callbackUrl = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    setAlreadyExists(false)
    setNotice(null)

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          setError(error.message)
          return
        }
        fetch('/api/auth/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'User signed in' }) })
        onSuccess()
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: callbackUrl() } })

        if (error) {
          setError(error.message)
          return
        }

        if (data.user?.identities?.length === 0) {
          setAlreadyExists(true)
          setError('An account with this email already exists. Please sign in instead.')
          return
        }

        getFaro()?.api.pushEvent('account_created')

        if (data.user && !data.session) {
          setNotice('Please check your email to confirm your account before signing in.')
          onConfirmationSent?.()
          return
        }

        fetch('/api/auth/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'User signed up' }) })
        onSuccess()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setAlreadyExists(false)
    setNotice(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl(),
      },
    })
    if (error) setError(error.message)
  }

  const emailId = idPrefix ? `${idPrefix}-email` : 'email'
  const passwordId = idPrefix ? `${idPrefix}-password` : 'password'

  const googleBtnClass = isAdvent
    ? isCollapsed
      ? `w-full flex items-center justify-center gap-3 rounded-lg border-2 border-gray-950 bg-yellow-300 hover:bg-yellow-400 py-3 px-4 text-sm font-bold text-gray-950 shadow-[3px_3px_0_#030712] ${ADVENT_PRESS}`
      : 'w-full flex items-center justify-center gap-3 rounded-lg border-2 border-gray-950 bg-white hover:bg-yellow-50 py-3 px-4 text-sm font-bold text-gray-950 transition-colors'
    : 'w-full flex items-center justify-center gap-3 rounded-lg py-3 px-4 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'

  const labelClass = isAdvent
    ? 'block text-[10px] font-bold uppercase tracking-widest text-gray-900 mb-1.5'
    : 'block text-sm font-medium text-gray-900 mb-2'

  const inputClass = isAdvent
    ? 'block w-full rounded-lg border-2 border-gray-950 bg-white py-2.5 px-3.5 text-sm text-gray-950 placeholder:text-gray-400 outline-none focus:border-gray-950 focus:bg-yellow-50 focus:ring-0 transition-colors'
    : 'block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm'

  const submitBtnClass = isAdvent
    ? `w-full rounded-lg border-2 border-gray-950 py-3 px-4 text-xs font-bold uppercase tracking-widest text-gray-950 shadow-[3px_3px_0_#030712] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 ${ADVENT_PRESS} ${
        isLoading ? 'bg-yellow-100 cursor-not-allowed shadow-none' : 'bg-yellow-300 hover:bg-yellow-400'
      }`
    : `w-full rounded-lg py-3 px-4 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 ${
        isLoading ? 'bg-yellow-100 cursor-not-allowed' : 'bg-yellow-300 hover:bg-yellow-400'
      }`

  const statusBanners = (
    <>
      {error && (
        <div
          role="alert"
          className={
            isAdvent
              ? 'rounded-lg border-2 border-red-700 bg-red-50 p-3 text-sm text-red-900 flex flex-wrap items-center justify-between gap-2'
              : 'bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 flex flex-wrap items-center justify-between gap-2'
          }
        >
          <span>{error}</span>
          {alreadyExists && (
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className={
                isAdvent
                  ? 'font-bold underline decoration-2 underline-offset-2 text-red-950 hover:text-black'
                  : 'font-semibold underline underline-offset-2 text-red-700 hover:text-red-900'
              }
            >
              Sign in instead
            </button>
          )}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className={
            isAdvent
              ? 'rounded-lg border-2 border-gray-950 bg-yellow-50 p-3.5 text-sm text-gray-950'
              : 'rounded-lg border border-yellow-300 bg-yellow-50 p-3.5 text-sm text-gray-900'
          }
        >
          <div className="flex items-start gap-2.5">
            <Mail className="mt-0.5 size-4 shrink-0 text-gray-950" strokeWidth={2.5} aria-hidden="true" />
            <div>
              <p className="font-semibold text-gray-950">{notice}</p>
              {confirmDetail && <p className="mt-1 text-xs leading-relaxed text-gray-700">{confirmDetail}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  )

  return (
    <>
      <button type="button" onClick={handleGoogleSignIn} className={googleBtnClass}>
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
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
        {isCollapsed ? googleLabel : expandedGoogleLabel}
      </button>

      {isCollapsed ? (
        <>
          {(error || notice) && <div className="mt-4 space-y-3">{statusBanners}</div>}
          <button
            type="button"
            onClick={() => setEmailExpanded(true)}
            className={
              isAdvent
                ? 'mt-3 w-full flex items-center justify-center gap-2 rounded-lg border-2 border-gray-950 bg-white hover:bg-gray-50 py-2.5 px-4 text-sm font-bold text-gray-950 transition-colors'
                : 'mt-3 w-full flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            }
          >
            <Mail className="size-4" strokeWidth={2.25} aria-hidden="true" />
            Continue with email
          </button>
          <p className="mt-4 text-center text-xs text-gray-500">
            Already have an account? Google or email will sign you right in.
          </p>
        </>
      ) : (
        <>
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className={isAdvent ? 'w-full border-t-2 border-gray-200' : 'w-full border-t border-gray-300'} />
            </div>
            <div className="relative flex justify-center">
              <span
                className={
                  isAdvent
                    ? 'bg-white px-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500'
                    : 'bg-white px-2 text-sm text-gray-500'
                }
              >
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {statusBanners}

            <div>
              <label htmlFor={emailId} className={labelClass}>
                Email
              </label>
              <input
                id={emailId}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div>
              <div className={isAdvent ? 'flex items-center justify-between mb-1.5' : 'flex items-center justify-between mb-2'}>
                <label
                  htmlFor={passwordId}
                  className={isAdvent ? 'text-[10px] font-bold uppercase tracking-widest text-gray-900' : 'text-sm font-medium text-gray-900'}
                >
                  Password
                </label>
                {mode === 'signup' && <span className="text-xs text-gray-500">Min. 6 characters</span>}
              </div>
              <div className="relative">
                <input
                  id={passwordId}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  minLength={mode === 'signup' ? 6 : undefined}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-950"
                >
                  {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className={submitBtnClass}>
              {isLoading ? 'Loading...' : mode === 'signin' ? submitLabels.signin : submitLabels.signup}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
              className={
                isAdvent
                  ? 'font-bold text-gray-950 underline decoration-2 underline-offset-2 hover:bg-yellow-200 px-0.5 rounded-xs'
                  : 'font-semibold text-yellow-600 hover:text-yellow-500'
              }
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </>
      )}
    </>
  )
}
