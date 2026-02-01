import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

  const { name } = await request.json()

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json(
      { error: 'List name is required' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('user_lists')
    .update({ name: name.trim() })
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
