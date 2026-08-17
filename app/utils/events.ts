import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const EVENT_SELECT = '*, shop:shop_id(*, company:company_id(*)), roaster:roaster_id(*)'

/**
 * The only sanctioned way to read `events`. `is_hidden` is the moderation gate,
 * but it lives in application code — the RLS policy is `SELECT USING (true)` —
 * so a read that forgets the filter serves hidden rows. It had been forgotten in
 * three of the four read paths, leaving hidden events fully reachable at their
 * permanent `/events/{slug}` URLs. Centralised here so the filter can't be
 * omitted by a caller, and tests/unit/hiddenEventsInvariant.test.ts fails if a
 * new caller selects from the table directly.
 *
 * The real fix is `USING (is_hidden = false)` in the RLS policy, which would
 * also close the hole for direct PostgREST reads with the public anon key; this
 * shores up the application layer in the meantime.
 */
export const visibleEvents = (select: string = EVENT_SELECT) =>
  supabase.from('events').select(select).eq('is_hidden', false)

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
