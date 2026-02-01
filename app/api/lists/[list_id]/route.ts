import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/lists/{list_id} - Get a single list
// Supports both authenticated (owner) access and public access for shared lists
export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ list_id: string }> }
) {
  const params = await props.params
  const { list_id } = params

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // First, try to fetch the list
  const { data, error } = await supabase
    .from('user_lists')
    .select(`
      *,
      items:user_list_items (
        id,
        created_at,
        shop:shops (*)
      )
    `)
    .eq('id', list_id)
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: 'List not found' },
      { status: 404 }
    )
  }

  // Check access: user is owner OR list is public
  const isOwner = user && data.user_id === user.id
  const isPublic = data.is_public === true

  if (!isOwner && !isPublic) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Include ownership flag in response
  return NextResponse.json({ ...data, isOwner })
}

// PATCH /api/lists/{list_id} - Rename a list
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ list_id: string }> }
) {
  const params = await props.params
  const { list_id } = params

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const body = await request.json()
  const { name, is_public } = body

  // Build update object based on provided fields
  const updates: Record<string, unknown> = {}

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'List name is required' },
        { status: 400 }
      )
    }
    updates.name = name.trim()
  }

  if (is_public !== undefined) {
    updates.is_public = Boolean(is_public)
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: 'No valid fields to update' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('user_lists')
    .update(updates)
    .eq('id', list_id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating list:', error.message)
    return NextResponse.json(
      { error: 'Error updating list' },
      { status: 500 }
    )
  }

  if (!data) {
    return NextResponse.json(
      { error: 'List not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(data)
}

// DELETE /api/lists/{list_id} - Delete a list (cascade deletes items)
export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<{ list_id: string }> }
) {
  const params = await props.params
  const { list_id } = params

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { error } = await supabase
    .from('user_lists')
    .delete()
    .eq('id', list_id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting list:', error.message)
    return NextResponse.json(
      { error: 'Error deleting list' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
