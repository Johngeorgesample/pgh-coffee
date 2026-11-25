import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { withMetrics } from '@/lib/withMetrics'

async function handleGET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('user_tasting_notes')
    .select('coffee_id, rating, tasted, method, body, updated_at')
    .eq('user_id', user.id)

  if (error) {
    logger.error('Error fetching tasting notes', { error: error.message })
    return NextResponse.json({ error: 'Error fetching tasting notes' }, { status: 500 })
  }
  return NextResponse.json(data)
}

export const GET = withMetrics('journal', handleGET)
