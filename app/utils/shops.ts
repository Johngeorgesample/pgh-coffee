import { createClient } from '@supabase/supabase-js'
import { DbShop } from '@/types/shop-types'
import { logger } from '@/lib/logger'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getShopByUuidPrefix = async (prefix: string): Promise<DbShop | null> => {
  // The `uuid` column is a Postgres `uuid` type, which has no LIKE operator, so
  // we can't prefix-match it as text. The 8-char prefix is exactly the first
  // group of the uuid, so a range bounded by the all-zero and all-f completions
  // matches every uuid sharing that prefix while still using the uuid index.
  const { data, error } = await supabase
    .from('shops')
    .select('*, company:company_id(*)')
    .gte('uuid', `${prefix}-0000-0000-0000-000000000000`)
    .lte('uuid', `${prefix}-ffff-ffff-ffff-ffffffffffff`)
    .limit(1)

  // Throw on a real query failure so callers can tell "the lookup failed" apart
  // from "no shop has this prefix" (data[0] === undefined). Swallowing the error
  // into null would mask a DB outage as a 404.
  if (error) {
    logger.error('Error fetching shop by uuid prefix', { error: error.message })
    throw new Error(`Failed to fetch shop by uuid prefix: ${error.message}`)
  }

  return data[0] ?? null
}
