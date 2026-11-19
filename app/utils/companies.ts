import { cache } from 'react'
import { logger } from '@/lib/logger'
import { getClient } from '@/lib/supabase/server-client'
import { SHOP_WITH_ROASTER_SELECT } from '@/app/utils/utils'

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

export const getCompanyWithShops = async (slug: string) => {
  const { data, error } = await getClient()
    .from('companies')
    .select(`*, shops!company_id(${SHOP_WITH_ROASTER_SELECT}), roaster!company_id(name, slug)`)
    .eq('slug', slug)
    .eq('shops.permanently_closed', false)
    .maybeSingle()

  if (error) {
    logger.error('Error fetching company with shops', { error: error.message })
    throw new Error(error.message)
  }
  if (!data) return null

  const { roaster, ...company } = data
  return { ...company, roaster: roaster[0] ?? null }
}

// cache() so generateMetadata, the page, and the OG image share one query per request.
export const getCompanyForSeo = cache(getCompanyWithShops)

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
