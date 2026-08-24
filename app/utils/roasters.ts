import { logger } from '@/lib/logger'
import { getClient } from '@/lib/supabase/server-client'

/**
 * Resolves a roaster from a `/roasters/{slug}` identifier. Roasters carry their
 * own text `slug` column, so this is a direct lookup (no uuid prefix decoding
 * like events/news). Shared by the server page and the `/api/roasters/[slug]`
 * route so both agree on the query.
 */
export const getRoasterBySlug = async (slug: string) => {
  const { data, error } = await getClient()
    .from('roaster')
    .select('*, company:company_id(*)')
    .eq('slug', slug)
    .single()

  if (error) {
    logger.error('Error fetching roaster', { error: error.message })
    return null
  }

  return data
}
