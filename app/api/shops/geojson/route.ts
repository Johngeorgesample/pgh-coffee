import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const fetchShops = async () => {
  let query = supabase.from('shops').select('*').order('name', { ascending: true })

  const { data, error } = await query
  if (error) {
    console.error('Error fetching shops:', error.message)
    return []
  }
  return data
}

const formatDataToGeoJSON = (shops: any[]) => {
  const myObj = {
    type: 'FeatureCollection',
    features: [],
  }

  shops.forEach(shop => {
    // @ts-ignore-next-line
    myObj.features.push({
      type: 'Feature',
      properties: {
        name: shop.name,
        neighborhood: shop.neighborhood,
        website: shop.website,
        address: shop.address,
        roaster: shop.roaster,
        photo: shop.photo,
      },
      geometry: {
        type: 'Point',
        coordinates: [shop.longitude, shop.latitude],
      },
    })
  })

  return myObj
}

// API Route Handler
export async function GET() {
  const shops = await fetchShops()
  const geojson = formatDataToGeoJSON(shops)

  if (!shops) {
    return NextResponse.json({ error: 'Error creating GeoJSON' }, { status: 500 })
  }

  return NextResponse.json(geojson)
}
