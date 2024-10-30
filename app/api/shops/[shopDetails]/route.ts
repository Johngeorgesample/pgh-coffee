import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const getShop = async (name: string, neighborhood: string) => {
  const { data, error } = await supabase.from('shops').select('*').eq('name', name).eq('neighborhood', neighborhood)

  return data
}

export async function GET(req: NextRequest, { params }: { params: { shopDetails: string } }) {
  const { shopDetails } = params

  const [name, neighborhood] = shopDetails.split('_').map(part => part.replace(/\+/g, ' '))

  const shopData = await getShop(name, neighborhood)

  if (shopData && shopData.length > 0) {
    const transformedData = {
      type: 'Feature',
      properties: {
        name: shopData[0].name,
        neighborhood: shopData[0].neighborhood,
        address: shopData[0].address,
        photo: shopData[0].photo,
        website: shopData[0].website,
      },
      geometry: {
        type: 'Point',
        coordinates: [shopData[0].longitude, shopData[0].latitude],
      },
    }

    return NextResponse.json(transformedData)
  } else {
    return NextResponse.json({ message: 'Shop not found' }, { status: 404 })
  }
}
