import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js'
import { getServerSupabaseEnv } from './env'

let client: SupabaseClient | undefined

/** Returns the shared, cookie-free Supabase client used by public server reads. */
export function getClient() {
  if (!client) {
    const { supabaseUrl, supabaseAnonKey } = getServerSupabaseEnv()
    client = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  }

  return client
}
