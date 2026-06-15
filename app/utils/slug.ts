import { slugify, extractUuidPrefix } from '@/app/utils/shopSlug'

export { extractUuidPrefix }

/**
 * Builds a `{slugified-title}-{uuid8}` identifier for a titled record (events,
 * news). The trailing 8 hex characters come from the record's `id`, matching the
 * shop slug convention (see buildShopSlug) so every detail URL on the site has
 * the same shape.
 */
export function buildContentSlug(item: { title: string; id: string }): string {
  return `${slugify(item.title)}-${item.id.slice(0, 8)}`
}
