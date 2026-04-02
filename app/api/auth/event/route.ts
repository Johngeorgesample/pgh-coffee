import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { event } = await request.json()
  logger.info(event, { userID: user.id, email: user.email ?? '' })

  if (event === 'User signed in') metrics.authSignIn()
  else if (event === 'User signed up') metrics.authSignUp()
  else if (event === 'User signed out') metrics.authSignOut()

  return NextResponse.json({ ok: true })
}
