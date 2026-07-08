import { createClient } from '@supabase/supabase-js'
import { getShopByUuidPrefix } from './shops'
import { getCompanyBySlug } from './companies'
import { getRoasterBySlug } from './roasters'
import type { ClaimType } from '@/types/claim-types'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface ClaimTarget {
  type: ClaimType
  id: string
  name: string
  subtitle?: string
  photo?: string
  // Company-only: how much the claim covers, for the scope copy.
  locationCount?: number
  hasRoaster?: boolean
}

// A company owns its shops and its roaster, and one person owns the company, so a
// claim always targets the company when one exists. Count what it covers off
// company_id only — a shop's roaster_id is "serves this coffee", not ownership.
// @TODO why are we making DB calls here?
async function companyTarget(id: string, name: string): Promise<ClaimTarget> {
  const [{ count, error: countError }, { data: roasters, error: roasterError }] = await Promise.all([
    supabase.from('shops').select('uuid', { count: 'exact', head: true }).eq('company_id', id),
    supabase.from('roaster').select('id').eq('company_id', id).limit(1),
  ])
  // Throw rather than silently show misleading coverage (0 locations / no roaster)
  // if a query fails — mirrors getShopByUuidPrefix, which throws on query failure.
  if (countError) throw new Error(`Failed to count company shops: ${countError.message}`)
  if (roasterError) throw new Error(`Failed to look up company roaster: ${roasterError.message}`)
  return { type: 'company', id, name, locationCount: count ?? 0, hasRoaster: (roasters?.length ?? 0) > 0 }
}

// Resolve a `/claim` entry (shop uuid, company slug, or roaster slug) to the entity
// the claim should actually target. Returns null when the entity can't be found.
export async function resolveClaimTarget(params: {
  shop?: string
  company?: string
  roaster?: string
}): Promise<ClaimTarget | null> {
  if (params.company) {
    const company = await getCompanyBySlug(params.company)
    return company ? companyTarget(company.id, company.name) : null
  }

  if (params.roaster) {
    const roaster = await getRoasterBySlug(params.roaster)
    if (!roaster) return null
    if (roaster.company_id && roaster.company) {
      return companyTarget(roaster.company.id, roaster.company.name)
    }
    return { type: 'roaster', id: roaster.id, name: roaster.name }
  }

  if (params.shop) {
    // The first uuid group is the prefix the lookup expects. Only query a
    // well-formed 8-hex prefix — a malformed bound makes the lookup throw.
    const prefix = params.shop.slice(0, 8)
    if (!/^[0-9a-f]{8}$/i.test(prefix)) return null
    const shop = await getShopByUuidPrefix(prefix)
    if (!shop) return null
    if (shop.company) return companyTarget(shop.company.id, shop.company.name)
    return { type: 'shop', id: shop.uuid, name: shop.name, subtitle: shop.neighborhood, photo: shop.photo ?? undefined }
  }

  return null
}
