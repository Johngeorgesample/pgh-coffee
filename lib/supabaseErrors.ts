// PGRST116 covers both "no rows" (the routes below always query by a unique
// id, so this is what actually happens) and "more than one row" for a query
// expecting exactly one — either way it's `.single()` telling us the lookup
// didn't resolve to a row, not a query failure. Every other code is a real
// failure (DB down, bad query) and must not masquerade as a 404 the way a
// missing row legitimately does. A type predicate (not just a boolean) so
// callers can read `.message` on the error afterward without a redundant
// null check.
export const isRealSupabaseError = <E extends { code?: string }>(error: E | null): error is E =>
  !!error && error.code !== 'PGRST116'
