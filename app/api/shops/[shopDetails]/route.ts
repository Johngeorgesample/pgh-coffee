import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { formatDBShopAsFeature } from '@/app/utils/utils'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'

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
    logger.error('Error fetching shop', { error: error.message })
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
    logger.warn('Shop not found', { name, neighborhood })
    metrics.shopNotFound(name)
    return NextResponse.json({ message: 'Shop not found' }, { status: 404 })
  }

  metrics.shopViewed(name, neighborhood)
  return NextResponse.json(formatDBShopAsFeature(shopData[0]))
}
