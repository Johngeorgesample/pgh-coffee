'use client'

import { createContext, use, useCallback, useEffect, useMemo, useReducer } from 'react'
import type { User, SupabaseClient } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

interface AuthState {
  user: User | null
  loading: boolean
  supabase: SupabaseClient | null
}

type AuthAction =
  | { type: 'SET_SUPABASE'; supabase: SupabaseClient }
  | { type: 'SET_USER'; user: User | null }
  | { type: 'SET_LOADING_DONE' }
  | { type: 'SET_USER_LOADED'; user: User | null }

const initialAuthState: AuthState = {
  user: null,
  loading: true,
  supabase: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_SUPABASE':
      return { ...state, supabase: action.supabase }
    case 'SET_USER':
      return { ...state, user: action.user }
    case 'SET_USER_LOADED':
      return { ...state, user: action.user, loading: false }
    case 'SET_LOADING_DONE':
      return { ...state, loading: false }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [{ user, loading, supabase }, dispatch] = useReducer(authReducer, initialAuthState)

  useEffect(() => {
    import('@/lib/supabase/client')
      .then(({ createClient }) => {
        dispatch({ type: 'SET_SUPABASE', supabase: createClient() })
      })
      .catch(error => {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to initialize Supabase client:', error)
        }
        dispatch({ type: 'SET_LOADING_DONE' })
      })
  }, [])

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getUser().then(({ data: { user } }) => {
      dispatch({ type: 'SET_USER_LOADED', user })
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch({ type: 'SET_USER_LOADED', user: session?.user ?? null })
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
  }, [supabase])

  const contextValue = useMemo(
    () => ({ user, loading, signOut }),
    [user, loading, signOut],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuth = () => use(AuthContext)
