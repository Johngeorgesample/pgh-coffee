import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const UPDATE_SELECT = '*, shop:shops(*, company:company_id(*)), roaster:roaster_id(id, name, slug)'

/**
 * Resolves a news update from a `/news/{slug}` identifier's id prefix. A full id
 * also works (`like('id', `${id}%`)` matches it exactly), so this doubles as the
 * lookup used to redirect legacy `?news={id}` links.
 */
export const getUpdateByIdPrefix = async (prefix: string) => {
  const { data, error } = await supabase
    .from('updates')
    .select(UPDATE_SELECT)
    .like('id', `${prefix}%`)
    .limit(1)

  if (error) {
    logger.error('Error fetching update', { error: error.message })
    return null
  }

  return data?.[0] ?? null
}
