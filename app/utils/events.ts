import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const EVENT_SELECT = '*, shop:shop_id(*, company:company_id(*)), roaster:roaster_id(*)'

/**
 * Resolves an event from a `/events/{slug}` identifier's id prefix. A full id
 * also works (`like('id', `${id}%`)` matches it exactly), so this doubles as the
 * lookup used to redirect legacy `?event={id}` links.
 */
export const getEventByIdPrefix = async (prefix: string) => {
  const { data, error } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .like('id', `${prefix}%`)
    .limit(1)

  if (error) {
    logger.error('Error fetching event', { error: error.message })
    return null
  }

  return data?.[0] ?? null
}
