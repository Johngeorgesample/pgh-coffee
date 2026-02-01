import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// DELETE /api/lists/{list_id}/items/{shop_id} - Remove a shop from a list
export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<{ list_id: string; shop_id: string }> }
) {
  const params = await props.params
  const { list_id, shop_id } = params

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Verify the list belongs to the user
  const { data: list, error: listError } = await supabase
    .from('user_lists')
    .select('id')
    .eq('id', list_id)
    .eq('user_id', user.id)
    .single()

  if (listError || !list) {
    return NextResponse.json(
      { error: 'List not found' },
      { status: 404 }
    )
  }

  const { error } = await supabase
    .from('user_list_items')
    .delete()
    .eq('list_id', list_id)
    .eq('shop_id', shop_id)

  if (error) {
    console.error('Error removing item from list:', error.message)
    return NextResponse.json(
      { error: 'Error removing item from list' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
