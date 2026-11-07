// Shared Cache-Control headers for anonymous, publicly-cacheable read endpoints.
//
// max-age=0 keeps the per-user browser cache from going stale (users still get
// fresh data on a hard navigation), while s-maxage lets the shared CDN
// (Netlify) serve cached copies across users — which is what absorbs traffic
// spikes and keeps these endpoints off the Supabase round-trip path. Mirrors
// the pattern already proven in app/api/featured-shop/route.ts.

// Shop / company / roaster / list data only changes when a moderator approves a
// submission, so it tolerates a multi-minute CDN TTL.
export const SHOP_DATA_TTL = 300

// News and events are more time-sensitive; keep the CDN window short.
export const TIME_SENSITIVE_TTL = 60

export function publicCacheHeaders(sMaxAge: number, staleWhileRevalidate = sMaxAge): Record<string, string> {
  return {
    'Cache-Control': `public, max-age=0, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
  }
}
