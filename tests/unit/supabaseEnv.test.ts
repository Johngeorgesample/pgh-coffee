import { describe, test, expect, afterEach, vi } from 'vitest'
import { getSupabaseEnv } from '@/lib/supabase/env'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('getSupabaseEnv', () => {
  test('returns the url and anon key when both are set', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon-key')

    expect(getSupabaseEnv()).toEqual({
      supabaseUrl: 'https://example.supabase.co',
      supabaseAnonKey: 'anon-key',
    })
  })

  test('throws when the url is missing', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon-key')

    expect(() => getSupabaseEnv()).toThrow('Missing Supabase environment variables')
  })

  test('throws when the anon key is missing', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')

    expect(() => getSupabaseEnv()).toThrow('Missing Supabase environment variables')
  })
})
