import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/lists/status/{shop_id} - Get all user's lists with has_shop boolean
export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ shop_id: string }> }
) {
  const params = await props.params
  const { shop_id } = params

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Get all user's lists
  const { data: lists, error: listsError } = await supabase
    .from('user_lists')
    .select('id, name, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (listsError) {
    console.error('Error fetching lists:', listsError.message)
    return NextResponse.json(
      { error: 'Error fetching lists' },
      { status: 500 }
    )
  }

  // Get list items for this shop
  const { data: listItems, error: itemsError } = await supabase
    .from('user_list_items')
    .select('list_id')
    .eq('shop_id', shop_id)
    .in('list_id', lists.map(l => l.id))

  if (itemsError) {
    console.error('Error fetching list items:', itemsError.message)
    return NextResponse.json(
      { error: 'Error fetching list items' },
      { status: 500 }
    )
  }

  const listIdsWithShop = new Set(listItems.map(item => item.list_id))

  const listsWithStatus = lists.map(list => ({
    ...list,
    has_shop: listIdsWithShop.has(list.id)
  }))

  return NextResponse.json(listsWithStatus)
}
