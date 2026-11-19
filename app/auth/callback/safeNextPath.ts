/**
 * Constrains a sign-in `next` parameter to a path on our own origin.
 *
 * It is used both appended to `origin` (OAuth callback) and handed bare to
 * `router.push` (password sign-in). A string check alone misses what URL
 * parsing does: `\` reads as `/`, tabs and newlines are stripped, and `.`
 * segments collapse — so `/\evil.com`, `/\t/evil.com` and `/.//evil.com` all
 * become `//evil.com`. Parse it the way the browser will, then require the
 * result to be a single-slash-rooted path on the same origin.
 */
const BASE = 'http://n'

export function safeNextPath(next: string | null): string {
  if (!next?.startsWith('/')) return '/'
  const url = new URL(next, BASE)
  const path = url.pathname + url.search + url.hash
  return url.origin === BASE && !path.startsWith('//') ? path : '/'
}
