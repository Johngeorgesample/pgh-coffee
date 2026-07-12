import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'
import type { Visit } from '@/app/utils/visitStats'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string

// Anonymous client: queries run as the `anon` Postgres role, so RLS only ever
// returns public profiles and their visits. This is what guarantees the public
// path can never read private data or any auth.users field (email, etc.).
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export interface PublicProfile {
  displayName: string | null
  avatarUrl: string | null
  visits: Visit[]
}

export const getPublicProfile = cache(async (id: string): Promise<PublicProfile | null> => {
  // A profile id is a user_id uuid; anything else can't match a row, and feeding
  // it to Postgres raises a uuid-syntax error we'd log at error level. Skip it.
  if (!UUID_RE.test(id)) return null

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('user_id, display_name, avatar_url')
    .eq('user_id', id)
    .eq('is_public', true)
    .maybeSingle()

  if (profileError) {
    logger.error('Error fetching profile', { error: profileError.message })
    return null
  }

  if (!profile) return null

  const { data: visitsData, error: visitsError } = await supabase
    .from('user_visits')
    .select('id, created_at, shop:shops (*, company:company_id (*))')
    .eq('user_id', profile.user_id)
    .order('created_at', { ascending: false })

  // Fail loudly rather than render a real profile as "0 visits": an RLS or
  // transient DB error must not be presented to visitors as truth.
  if (visitsError) {
    logger.error('Error fetching profile visits', { error: visitsError.message })
    throw new Error('Failed to load profile visits')
  }

  return {
    displayName: profile.display_name,
    avatarUrl: profile.avatar_url,
    visits: (visitsData ?? []) as unknown as Visit[],
  }
})
