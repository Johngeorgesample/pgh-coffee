import { logger } from '@/lib/logger'
import { getClient } from '@/lib/supabase/server-client'

const EVENT_SELECT = '*, shop:shop_id(*, company:company_id(*)), roaster:roaster_id(*)'

export const visibleEvents = (select: string = EVENT_SELECT) =>
  getClient().from('events').select(select).eq('is_hidden', false)

/**
 * Resolves an event from a `/events/{slug}` identifier's id prefix. The `id`
 * column is a Postgres `uuid`, which has no LIKE operator, so we bound a range
 * by the all-zero and all-f completions of the 8-char prefix (the uuid's first
 * group) instead of prefix-matching as text. A full id is also covered, since it
 * falls within its own prefix range.
 */
export const getEventByIdPrefix = async (prefix: string) => {
  const { data, error } = await visibleEvents()
    .gte('id', `${prefix}-0000-0000-0000-000000000000`)
    .lte('id', `${prefix}-ffff-ffff-ffff-ffffffffffff`)
    .limit(1)

  if (error) {
    logger.error('Error fetching event', { error: error.message })
    return null
  }

  return data?.[0] ?? null
}
