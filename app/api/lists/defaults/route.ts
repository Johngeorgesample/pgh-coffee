import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ensureDefaultLists } from '@/lib/lists/ensureDefaultLists'

// GET /api/lists/defaults - Ensure default lists exist and return their IDs
// Returns: { [listName]: listId }
export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const lists = await ensureDefaultLists(supabase, user)

  return NextResponse.json(lists)
}
