import { createClient } from '@supabase/supabase-js'
import { DbShop } from '@/types/shop-types'
import { logger } from '@/lib/logger'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getShopByNameAndNeighborhood = async (name: string, neighborhood: string): Promise<DbShop | null> => {
  const { data, error } = await supabase
    .from('shops')
    .select('*, company:company_id(*)')
    .eq('name', name)
    .eq('neighborhood', neighborhood)

  if (error) {
    logger.error('Error fetching shop', { error: error.message })
    return null
  }

  return data[0] ?? null
}

export const getShopByUuidPrefix = async (prefix: string): Promise<DbShop | null> => {
  const { data, error } = await supabase
    .from('shops')
    .select('*, company:company_id(*)')
    .like('uuid', `${prefix}%`)
    .limit(1)

  if (error) {
    logger.error('Error fetching shops', { error: error.message })
    return null
  }

  return data[0] ?? null
}
