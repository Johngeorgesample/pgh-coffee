// Every code but PGRST116 ("no rows", the only outcome `.single()` on a
// unique-id lookup can return besides success) is a real failure and must
// not masquerade as a 404 the way a missing row legitimately does. A type
// predicate (not just a boolean) so callers can read `.message` on the
// error afterward without a redundant null check.
export const isRealSupabaseError = <E extends { code?: string }>(error: E | null): error is E =>
  !!error && error.code !== 'PGRST116'
