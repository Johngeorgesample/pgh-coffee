import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const getShop = async (name: string, neighborhood: string) => {
  const { data, error } = await supabase
    .from('shops')
    .select('*, company:company_id(*)')
    .eq('name', name)
    .eq('neighborhood', neighborhood)

  if (error) {
    console.error('Error fetching shop:', error.message)
    return null
  }

  return data
}

export async function GET(req: NextRequest, props: { params: Promise<{ shopDetails: string }> }) {
  const params = await props.params
  const { shopDetails } = params

  const [name, neighborhood] = shopDetails.split('_')

  const shopData = await getShop(name, neighborhood)

  if (shopData === null) {
    return NextResponse.json({ error: 'Error fetching shop' }, { status: 500 })
  }

  if (shopData.length === 0) {
    return NextResponse.json({ message: 'Shop not found' }, { status: 404 })
  }

  const transformedData = {
    type: 'Feature',
    properties: {
      name: shopData[0].name,
      neighborhood: shopData[0].neighborhood,
      address: shopData[0].address,
      photo: shopData[0].photo,
      photos: shopData[0].photos ?? undefined,
      website: shopData[0].website,
      uuid: shopData[0].uuid,
      company: shopData[0].company,
    },
    geometry: {
      type: 'Point',
      coordinates: [shopData[0].longitude, shopData[0].latitude],
    },
  }

  return NextResponse.json(transformedData)
}
