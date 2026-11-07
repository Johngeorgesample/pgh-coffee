import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('user_id, display_name, avatar_url, is_public')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    logger.error('Error fetching own profile', { error: error.message })
    return NextResponse.json({ error: 'Error fetching profile' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  if (body.is_public === undefined) {
    return NextResponse.json({ error: 'No valid fields to update.' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ is_public: Boolean(body.is_public) })
    .eq('user_id', user.id)
    .select('user_id, display_name, avatar_url, is_public')
    .single()

  if (error) {
    logger.error('Error updating profile', { error: error.message })
    return NextResponse.json({ error: 'Error updating profile' }, { status: 500 })
  }

  return NextResponse.json(data)
}
