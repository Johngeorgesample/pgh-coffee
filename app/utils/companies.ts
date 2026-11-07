import { cache } from 'react'
import { logger } from '@/lib/logger'
import { getClient } from '@/lib/supabase/server-client'

/**
 * Resolves a company from a `/companies/{slug}` identifier. Companies carry their
 * own text `slug` column, so this is a direct lookup (no uuid prefix decoding
 * like events/news). Shared by the server page and the `/api/companies/[company]`
 * route so both agree on the lookup.
 */
export const getCompanyBySlug = async (slug: string) => {
  const { data, error } = await getClient()
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    logger.error('Error fetching company', { error: error.message })
    return null
  }

  return data
}

// cache() so generateMetadata, the page, and the OG image share one query per request.
export const getCompanyForSeo = cache(getCompanyBySlug)

export const getCompanyShopPhotos = async (companyId: string) => {
  const { data, error } = await getClient()
    .from('shops')
    .select('photo')
    .eq('company_id', companyId)
    .eq('permanently_closed', false)

  if (error) {
    logger.error('Error fetching company shop photos', { error: error.message })
    return []
  }

  return data.map((shop) => shop.photo as string | null)
}
