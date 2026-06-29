import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'
import type { DbShop } from '@/types/shop-types'
import type { Visit } from '@/app/utils/visitStats'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string

// Anonymous client: queries run as the `anon` Postgres role, so RLS only ever
// returns public profiles, the visits of public profiles, and public lists.
// This is what guarantees the public path can never read private data or any
// auth.users field (email, etc.).
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface PublicList {
  id: string
  name: string
  description: string | null
  shops: DbShop[]
}

export interface PublicProfile {
  username: string
  displayName: string | null
  avatarUrl: string | null
  visits: Visit[]
  lists: PublicList[]
}

/**
 * Resolves a public profile from a `/u/{username}` identifier, along with the
 * user's visits and public lists. Shared by the server page and the
 * `/api/profiles/[username]` route so both agree on the lookup. Returns null
 * when the username doesn't exist or the profile isn't public.
 */
export const getPublicProfile = cache(async (username: string): Promise<PublicProfile | null> => {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('user_id, username, display_name, avatar_url')
    .eq('username', username)
    .eq('is_public', true)
    .maybeSingle()

  if (profileError) {
    logger.error('Error fetching profile', { error: profileError.message })
    return null
  }

  if (!profile) return null

  const [visitsResult, listsResult] = await Promise.all([
    supabase
      .from('user_visits')
      .select('id, created_at, shop:shops (*)')
      .eq('user_id', profile.user_id)
      .order('created_at', { ascending: false }),
    supabase
      .from('user_lists')
      .select('id, name, description, items:user_list_items (shop:shops (*))')
      .eq('user_id', profile.user_id)
      .eq('is_public', true)
      .order('created_at', { ascending: false }),
  ])

  if (visitsResult.error) {
    logger.error('Error fetching profile visits', { error: visitsResult.error.message })
  }
  if (listsResult.error) {
    logger.error('Error fetching profile lists', { error: listsResult.error.message })
  }

  const visits = (visitsResult.data ?? []) as unknown as Visit[]

  const lists: PublicList[] = (listsResult.data ?? []).map((list) => ({
    id: list.id,
    name: list.name,
    description: list.description,
    shops: ((list.items ?? []) as unknown as { shop: DbShop }[])
      .map((item) => item.shop)
      .filter(Boolean),
  }))

  return {
    username: profile.username,
    displayName: profile.display_name,
    avatarUrl: profile.avatar_url,
    visits,
    lists,
  }
})
