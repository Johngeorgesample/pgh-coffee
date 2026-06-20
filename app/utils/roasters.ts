import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Resolves a roaster from a `/roasters/{slug}` identifier. Roasters carry their
 * own text `slug` column, so this is a direct lookup (no uuid prefix decoding
 * like events/news). Shared by the server page and the `/api/roasters/[slug]`
 * route so both agree on the query.
 */
export const getRoasterBySlug = async (slug: string) => {
  const { data, error } = await supabase
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
