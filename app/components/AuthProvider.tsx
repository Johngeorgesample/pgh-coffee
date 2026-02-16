'use client'

import { createContext, useContext, useEffect, useState } from 'react'
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  useEffect(() => {
    import('@/lib/supabase/client')
      .then(({ createClient }) => {
        setSupabase(createClient())
      })
      .catch(error => {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to initialize Supabase client:', error)
        }
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
  }

  return <AuthContext.Provider value={{ user, loading, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
