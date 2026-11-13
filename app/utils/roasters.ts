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

export const getRoasterWithShops = async (slug: string) => {
  const { data, error } = await getClient()
    .from('roaster')
    .select(`*, company:company_id(*), shops!roaster_id(${SHOP_WITH_ROASTER_SELECT})`)
    .eq('slug', slug)
    .eq('shops.permanently_closed', false)
    .maybeSingle()

  if (error) {
    logger.error('Error fetching roaster with shops', { error: error.message })
    throw new Error(error.message)
  }

  return data && withCompanyVerification(data)
}

// cache() so generateMetadata, the page, and the OG image share one query per request.
export const getRoasterForSeo = cache(getRoasterWithShops)
