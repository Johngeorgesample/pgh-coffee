import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

const USERNAME_RE = /^[a-z0-9_]{3,30}$/

// Reserved so a username can never shadow an existing top-level route.
const RESERVED = new Set([
  'u', 'account', 'api', 'admin', 'about', 'settings', 'sign-in', 'auth',
  'submit-a-shop', 'shops', 'roasters', 'companies', 'news', 'events',
])

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('username, display_name, avatar_url, is_public')
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
  const updates: { username?: string; display_name?: string; is_public?: boolean } = {}

  if (body.username !== undefined) {
    const username = String(body.username).toLowerCase().trim()
    if (!USERNAME_RE.test(username)) {
      return NextResponse.json(
        { error: 'Username must be 3–30 characters: lowercase letters, numbers, or underscores.' },
        { status: 400 },
      )
    }
    if (RESERVED.has(username)) {
      return NextResponse.json({ error: 'That username is reserved.' }, { status: 400 })
    }
    updates.username = username
  }

  if (body.display_name !== undefined) {
    updates.display_name = String(body.display_name).trim()
  }

  if (body.is_public !== undefined) {
    updates.is_public = Boolean(body.is_public)
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update.' }, { status: 400 })
  }

  // A profile can only go public once it has a username to live at.
  if (updates.is_public === true && updates.username === undefined) {
    const { data: existing } = await supabase
      .from('profiles')
      .select('username')
      .eq('user_id', user.id)
      .maybeSingle()
    if (!existing?.username) {
      return NextResponse.json(
        { error: 'Choose a username before making your profile public.' },
        { status: 400 },
      )
    }
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', user.id)
    .select('username, display_name, avatar_url, is_public')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'That username is taken.' }, { status: 409 })
    }
    logger.error('Error updating profile', { error: error.message })
    return NextResponse.json({ error: 'Error updating profile' }, { status: 500 })
  }

  return NextResponse.json(data)
}
