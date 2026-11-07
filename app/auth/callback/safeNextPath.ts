/**
 * Constrains the OAuth callback's `next` parameter to a path on our own origin.
 *
 * The callback builds its redirect as `${origin}${next}`, and `origin` carries no
 * trailing slash — so an unchecked `next` escapes the host entirely: `@evil.com`
 * parses as userinfo plus host `evil.com`, and `.evil.com` yields
 * `pgh.coffee.evil.com`. Since the OAuth `redirect_to` is chosen by whoever
 * builds the sign-in link, that turns a genuine Google sign-in into a redirect
 * to an attacker's page. Only a single-slash-rooted path is safe to append.
 */
export function safeNextPath(next: string | null): string {
  if (!next?.startsWith('/') || next.startsWith('//')) return '/'
  return next
}
