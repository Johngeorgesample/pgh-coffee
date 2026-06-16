// Matches Unicode combining diacritical marks (U+0300–U+036F), produced by
// String.prototype.normalize('NFD') splitting accented characters (e.g. "é")
// into a base letter plus a combining mark.
const COMBINING_MARKS = new RegExp(`[${String.fromCharCode(0x0300)}-${String.fromCharCode(0x036f)}]`, 'g')

/**
 * Builds the `/shops/{slug}` identifier for a shop. The trailing 8 hex
 * characters are taken from the shop's `uuid` column, so the slug stays
 * effectively unique even for shops that share a name and neighborhood
 * (e.g. the multiple "Yinz Coffee" locations). An 8-char prefix isn't a
 * strict guarantee, but collisions across the shop dataset are negligible.
 */
export function buildShopSlug(shop: { name: string; neighborhood: string; uuid: string }): string {
  // Lowercase the prefix so it always agrees with extractUuidPrefix() (which
  // lowercases): an uppercase-hex uuid would otherwise yield a slug that
  // disagrees with the route value and cause avoidable refetches.
  return `${slugify(shop.name)}-${slugify(shop.neighborhood)}-${shop.uuid.slice(0, 8).toLowerCase()}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Extracts the 8-character uuid prefix from a `/shops/{slug}` identifier,
 * or null if the slug doesn't end in one.
 */
export function extractUuidPrefix(slug: string): string | null {
  const match = slug.match(/-([0-9a-f]{8})$/i)
  return match ? match[1].toLowerCase() : null
}
