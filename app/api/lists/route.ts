import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/lists - Get all lists for the current user
export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { data, error } = await supabase
    .from('user_lists')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching lists:', error.message)
    return NextResponse.json(
      { error: 'Error fetching lists' },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}

// POST /api/lists - Create a new list
export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { name } = await request.json()

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json(
      { error: 'List name is required' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('user_lists')
    .insert({ user_id: user.id, name: name.trim() })
    .select()
    .single()

  if (error) {
    console.error('Error creating list:', error.message)
    return NextResponse.json(
      { error: 'Error creating list' },
      { status: 500 }
    )
  }

  return NextResponse.json(data, { status: 201 })
}
