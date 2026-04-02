import type { Config } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import { metrics } from '@/lib/metrics'

export default async function handler() {
  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_ANON_KEY as string,
  )

  const { data, error } = await supabase
    .from('shops')
    .select('neighborhood')

  if (error || !data) return

  const counts = data.reduce<Record<string, number>>((acc, { neighborhood }) => {
    if (neighborhood) acc[neighborhood] = (acc[neighborhood] ?? 0) + 1
    return acc
  }, {})

  for (const [neighborhood, count] of Object.entries(counts)) {
    metrics.shopsPerNeighborhood(neighborhood, count)
  }
}

export const config: Config = {
  schedule: '0 0 * * *',
}
