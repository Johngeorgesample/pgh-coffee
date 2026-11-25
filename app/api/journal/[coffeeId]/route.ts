import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { withMetrics } from '@/lib/withMetrics'
import { findAdventDayByCoffeeId } from '@/data/advent'

const MAX_TASTED = 20
const MAX_NOTE = 50
const MAX_METHOD = 100
const MAX_BODY = 2000

const isText = (value: unknown, max: number) => typeof value === 'string' && value.length <= max

const isTastedList = (value: unknown) =>
  Array.isArray(value) && value.length <= MAX_TASTED && value.every(note => isText(note, MAX_NOTE))

const isRating = (value: unknown) => Number.isInteger(value) && (value as number) >= 1 && (value as number) <= 5

const isCup = (cup: Record<string, unknown>) =>
  isRating(cup.rating) && isTastedList(cup.tasted) && isText(cup.method, MAX_METHOD) && isText(cup.body, MAX_BODY)

const toRow = (userID: string, coffeeId: string, cup: Record<string, unknown>) => ({
  user_id: userID,
  coffee_id: coffeeId,
  rating: cup.rating,
  tasted: cup.tasted,
  method: cup.method || null,
  body: cup.body || null,
  updated_at: new Date().toISOString(),
})

const badRequest = (error: string) => NextResponse.json({ error }, { status: 400 })

async function readCup(request: Request) {
  const cup = await request.json().catch(() => null)
  return cup && typeof cup === 'object' && isCup(cup) ? (cup as Record<string, unknown>) : null
}

async function handlePUT(request: Request, props: { params: Promise<{ coffeeId: string }> }) {
  const { coffeeId } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!findAdventDayByCoffeeId(coffeeId)) return badRequest('Unknown coffee')

  const cup = await readCup(request)
  if (!cup) return badRequest(`Expected rating 1–5, up to ${MAX_TASTED} tasted notes, and method/body strings`)

  const { error } = await supabase.from('user_tasting_notes').upsert(toRow(user.id, coffeeId, cup), { onConflict: 'user_id,coffee_id' })
  if (error) {
    logger.error('Error saving tasting note', { error: error.message })
    return NextResponse.json({ error: 'Error saving tasting note' }, { status: 500 })
  }
  logger.info('Saved tasting note', { coffeeId, userID: user.id })
  return NextResponse.json({ success: true })
}

export const PUT = withMetrics('journal/[coffeeId]:PUT', handlePUT)
