// Matches Unicode combining diacritical marks (U+0300–U+036F), produced by
// String.prototype.normalize('NFD') splitting accented characters (e.g. "é")
// into a base letter plus a combining mark.
const COMBINING_MARKS = new RegExp(`[${String.fromCharCode(0x0300)}-${String.fromCharCode(0x036f)}]`, 'g')

// The 8-char uuid suffix keeps slugs distinct for shops that share a name and
// neighborhood (e.g. the multiple "Yinz Coffee" locations). Not a strict
// uniqueness guarantee, but collisions across the dataset are negligible.
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

export function extractUuidPrefix(slug: string): string | null {
  const match = slug.match(/-([0-9a-f]{8})$/i)
  return match ? match[1].toLowerCase() : null
}
