import { SupabaseClient } from '@supabase/supabase-js'

export const DEFAULT_LISTS = ['Favorites', 'Want to Try']

/**
 * Ensures the given list names exist for a user, creating any that are missing.
 * Returns a map of list name → list id.
 */
export async function ensureDefaultLists(
  supabase: SupabaseClient,
  userId: string,
  listNames: string[] = DEFAULT_LISTS,
): Promise<Record<string, string>> {
  const { data: existing } = await supabase
    .from('user_lists')
    .select('id, name')
    .eq('user_id', userId)
    .in('name', listNames)

  const existingMap: Record<string, string> = {}
  for (const list of existing ?? []) {
    existingMap[list.name] = list.id
  }

  const missing = listNames.filter(name => !existingMap[name])

  if (missing.length > 0) {
    const { data: created, error } = await supabase
      .from('user_lists')
      .insert(missing.map(name => ({ user_id: userId, name })))
      .select('id, name')

    if (error) {
      console.error('Error creating default lists:', error.message)
    }

    for (const list of created ?? []) {
      existingMap[list.name] = list.id
    }
  }

  return existingMap
}
