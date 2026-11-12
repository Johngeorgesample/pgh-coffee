import { cache } from 'react'
import { logger } from '@/lib/logger'
import { getClient } from '@/lib/supabase/server-client'
import { withCompanyVerification } from '@/app/utils/verification'
import { SHOP_WITH_ROASTER_SELECT } from '@/app/utils/utils'

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

  return withCompanyVerification(data)
}

// cache() so generateMetadata, the page, and the OG image share one query per request.
export const getRoasterForSeo = cache(getRoasterBySlug)

// Shops that serve this roaster's coffee (joined via shops.roaster_id), so the
// roaster page can show where to drink it. Mirrors getCompanyShops.
export const getRoasterShops = async (roasterId: string) => {
  const { data, error } = await getClient()
    .from('shops')
    .select(SHOP_WITH_ROASTER_SELECT)
    .eq('roaster_id', roasterId)
    .eq('permanently_closed', false)

  if (error) {
    logger.error('Error fetching roaster shops', { error: error.message })
    return null
  }

  return data
}
