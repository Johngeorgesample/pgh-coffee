import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const UPDATE_SELECT = '*, shop:shops(*, company:company_id(*)), roaster:roaster_id(id, name, slug)'

/**
 * Resolves a news update from a `/news/{slug}` identifier's id prefix. The `id`
 * column is a Postgres `uuid`, which has no LIKE operator, so we bound a range
 * by the all-zero and all-f completions of the 8-char prefix (the uuid's first
 * group) instead of prefix-matching as text. A full id is also covered, since it
 * falls within its own prefix range.
 */
export const getUpdateByIdPrefix = async (prefix: string) => {
  const { data, error } = await supabase
    .from('updates')
    .select(UPDATE_SELECT)
    .gte('id', `${prefix}-0000-0000-0000-000000000000`)
    .lte('id', `${prefix}-ffff-ffff-ffff-ffffffffffff`)
    .limit(1)

  if (error) {
    logger.error('Error fetching update', { error: error.message })
    return null
  }

  return data?.[0] ?? null
}
