import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/lists - Get all lists for the current user
// Optional query param: ?photos=true to include shop photos
export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const includePhotos = request.nextUrl.searchParams.has('photos')

  if (includePhotos) {
    // Fetch lists with their items and shop photos
    const { data, error } = await supabase
      .from('user_lists')
      .select(`
        *,
        user_list_items (
          shop:shops (
            photo
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching lists:', error.message)
      return NextResponse.json(
        { error: 'Error fetching lists' },
        { status: 500 }
      )
    }

    // Transform the data to include photos array at the list level
    const listsWithPhotos = data.map((list) => {
      const photos = list.user_list_items
        ?.map((item: { shop: { photo: string | null } | null }) => item.shop?.photo)
        .filter((photo: string | null): photo is string => photo !== null)

      const { user_list_items: _items, ...listData } = list
      return {
        ...listData,
        photos,
      }
    })

    return NextResponse.json(listsWithPhotos)
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
