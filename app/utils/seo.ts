import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'
import type { CafeOrCoffeeShopLeaf, CollectionPageLeaf, Event, NewsArticle, OrganizationLeaf, Place, WebSite, WithContext } from 'schema-dts'
import { DbShop } from '@/types/shop-types'
import { logger } from '@/lib/logger'
import { buildShopSlug, extractUuidPrefix } from '@/app/utils/shopSlug'
import { getShopByUuidPrefix } from '@/app/utils/shops'
import { buildContentSlug } from '@/app/utils/slug'
import { getEventByIdPrefix } from '@/app/utils/events'
import { getUpdateByIdPrefix } from '@/app/utils/updates'

export const SITE_URL = 'https://pgh.coffee'
export const SITE_NAME = 'pgh.coffee'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string

/** The shop fields needed to build a `/shops/{slug}` identifier. */
export type ShopSlugInput = { name: string; neighborhood: string; uuid: string }

/** Builds the root-relative `/shops/{slug}` path for a shop. */
export function buildShopPath(shop: ShopSlugInput): string {
  return `/shops/${buildShopSlug(shop)}`
}

export function buildShopUrl(shop: ShopSlugInput): string {
  return `${SITE_URL}${buildShopPath(shop)}`
}

export interface ParsedAddress {
  streetAddress: string
  addressLocality: string
  addressRegion: string
  postalCode: string
}

/**
 * Parses a "123 Main St, Pittsburgh, PA 15213" style address into PostalAddress
 * components. Returns null if the address doesn't match the expected
 * "<street>, <city>, <ST> <ZIP>" format rather than guessing at a split.
 */
export function parseAddress(address: string): ParsedAddress | null {
  const match = address.match(/^(.+), ([^,]+), ([A-Z]{2}) (\d{5}(?:-\d{4})?)$/)
  if (!match) return null

  const [, streetAddress, addressLocality, addressRegion, postalCode] = match
  return {
    streetAddress: streetAddress.trim(),
    addressLocality: addressLocality.trim(),
    addressRegion,
    postalCode,
  }
}

/**
 * Serializes a JSON-LD object for embedding in a <script type="application/ld+json">
 * tag, escaping `<` so shop data (e.g. a name containing "</script>") can't
 * break out of the tag.
 */
export function jsonLdToString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

function getSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Resolves the shop for a `/shops/{slug}` page from its uuid prefix, or null if
 * the slug has no prefix / matches nothing. Wrapped in React's cache() so
 * generateMetadata and the page body share one query per request.
 */
export const getShopForSeo = cache(async (slug: string): Promise<DbShop | null> => {
  const prefix = extractUuidPrefix(slug)
  return prefix ? getShopByUuidPrefix(prefix) : null
})

export interface ShopListEntry {
  name: string
  neighborhood: string
  uuid: string
}

/**
 * Fetches every shop's name, neighborhood, and uuid for building the sitemap and
 * the shop-list JSON-LD. No deduping is needed: each shop has its own
 * `/shops/{slug}` URL (the uuid suffix keeps same-name locations distinct).
 */
export const getAllShopsForSeo = cache(async (): Promise<ShopListEntry[]> => {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('shops')
    .select('name, neighborhood, uuid')
    .order('name', { ascending: true })

  if (error || !data) {
    if (error) logger.error('Error fetching shops for SEO', { error: error.message })
    return []
  }

  return data as ShopListEntry[]
})

/**
 * Builds OG/Twitter metadata for a shop page from real shop data. Now that shops
 * live at a real `/shops/{slug}` path, canonical/og:url are expressed through the
 * metadata API (resolved against metadataBase in the root layout).
 * Image/photo fields are only set when present; otherwise the root layout's
 * site-default image is inherited via Next's metadata merging.
 */
export function buildShopMetadata(shop: DbShop): Metadata {
  const title = `${shop.name} | ${shop.neighborhood} | pgh.coffee`
  const description = `${shop.name} is an independent coffee shop in ${shop.neighborhood}, Pittsburgh — ${shop.address}.`
  const path = buildShopPath(shop)

  const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: 'website',
      url: path,
    },
    twitter: shop.photo
      ? { card: 'summary_large_image', title, description, images: [shop.photo] }
      : { title, description },
  }

  if (shop.photo) {
    metadata.openGraph!.images = [{ url: shop.photo }]
  }

  return metadata
}

/**
 * Builds CafeOrCoffeeShop JSON-LD from real shop data only. Fields without
 * reliable source data (telephone, opening hours, price range — none of
 * which exist in the shops table) are omitted rather than guessed.
 */
export function buildShopJsonLd(shop: DbShop): WithContext<CafeOrCoffeeShopLeaf> {
  const jsonLd: WithContext<CafeOrCoffeeShopLeaf> = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: shop.name,
  }

  const address = parseAddress(shop.address)
  if (address) {
    jsonLd.address = {
      '@type': 'PostalAddress',
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: 'US',
    }
  }

  if (shop.latitude != null && shop.longitude != null) {
    jsonLd.geo = {
      '@type': 'GeoCoordinates',
      latitude: shop.latitude,
      longitude: shop.longitude,
    }
  }

  if (shop.photo) {
    jsonLd.image = shop.photo
  }

  if (shop.website) {
    jsonLd.url = shop.website
  }

  const sameAs: string[] = []
  if (shop.company?.website) sameAs.push(shop.company.website)
  if (shop.company?.instagram_handle) {
    sameAs.push(`https://www.instagram.com/${shop.company.instagram_handle.replace(/^@/, '')}/`)
  }
  if (sameAs.length > 0) jsonLd.sameAs = sameAs

  return jsonLd
}

export function buildOrganizationJsonLd(): WithContext<OrganizationLeaf> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512x512.png`,
    sameAs: ['https://www.instagram.com/pgh.coffee/'],
  }
}

export function buildWebsiteJsonLd(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  }
}

/**
 * CollectionPage + ItemList JSON-LD for the shop directory (the home map),
 * giving crawlers a list of every shop page even though the map itself is
 * client-rendered.
 */
export function buildShopListJsonLd(shops: ShopListEntry[]): WithContext<CollectionPageLeaf> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Coffee shops in Pittsburgh',
    url: SITE_URL,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: shops.map((shop, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: shop.name,
        url: buildShopUrl(shop),
      })),
    },
  }
}

// ---------------------------------------------------------------------------
// Events & news (updates)
// ---------------------------------------------------------------------------

export interface SeoShopRef {
  name: string
  neighborhood?: string | null
  address?: string | null
  latitude?: number | null
  longitude?: number | null
}

export interface SeoEvent {
  id: string
  title: string
  description?: string | null
  url?: string | null
  event_date?: string | null
  shop?: SeoShopRef | null
}

export interface SeoUpdate {
  id: string
  title: string
  description?: string | null
  url?: string | null
  post_date?: string | null
}

export interface ContentListEntry {
  id: string
  title: string
}

export function buildEventPath(event: ContentListEntry): string {
  return `/events/${buildContentSlug(event)}`
}

export function buildEventUrl(event: ContentListEntry): string {
  return `${SITE_URL}${buildEventPath(event)}`
}

export function buildNewsPath(update: ContentListEntry): string {
  return `/news/${buildContentSlug(update)}`
}

export function buildNewsUrl(update: ContentListEntry): string {
  return `${SITE_URL}${buildNewsPath(update)}`
}

/**
 * Resolves the event for a `/events/{slug}` page from its id prefix. Wrapped in
 * cache() so generateMetadata and the page body share one query per request.
 */
export const getEventForSeo = cache(async (slug: string): Promise<SeoEvent | null> => {
  const prefix = extractUuidPrefix(slug)
  return prefix ? await getEventByIdPrefix(prefix) : null
})

/** Same as getEventForSeo, for `/news/{slug}` pages. */
export const getUpdateForSeo = cache(async (slug: string): Promise<SeoUpdate | null> => {
  const prefix = extractUuidPrefix(slug)
  return prefix ? await getUpdateByIdPrefix(prefix) : null
})

export const getAllEventsForSeo = cache(async (): Promise<ContentListEntry[]> => {
  const supabase = getSupabase()
  const { data, error } = await supabase.from('events').select('id, title').order('event_date', { ascending: false })

  if (error || !data) {
    if (error) logger.error('Error fetching events for SEO', { error: error.message })
    return []
  }

  return data as ContentListEntry[]
})

export const getAllUpdatesForSeo = cache(async (): Promise<ContentListEntry[]> => {
  const supabase = getSupabase()
  const { data, error } = await supabase.from('updates').select('id, title').order('post_date', { ascending: false })

  if (error || !data) {
    if (error) logger.error('Error fetching updates for SEO', { error: error.message })
    return []
  }

  return data as ContentListEntry[]
})

export function buildEventMetadata(event: SeoEvent): Metadata {
  const title = `${event.title} | pgh.coffee`
  const description =
    event.description?.trim() ||
    `${event.title}${event.shop ? ` at ${event.shop.name}` : ''} — a coffee event in Pittsburgh.`
  const path = buildEventPath(event)

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, type: 'article', url: path },
    twitter: { card: 'summary', title, description },
  }
}

function buildEventPlace(shop: SeoShopRef): Place {
  const parsed = shop.address ? parseAddress(shop.address) : null

  return {
    '@type': 'Place',
    name: shop.name,
    ...(parsed
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: parsed.streetAddress,
            addressLocality: parsed.addressLocality,
            addressRegion: parsed.addressRegion,
            postalCode: parsed.postalCode,
            addressCountry: 'US',
          },
        }
      : shop.address
        ? { address: shop.address }
        : {}),
    ...(shop.latitude != null && shop.longitude != null
      ? { geo: { '@type': 'GeoCoordinates', latitude: shop.latitude, longitude: shop.longitude } }
      : {}),
  }
}

/**
 * Builds Event JSON-LD from real event data only. Fields without source data
 * (endDate, offers, performer) are omitted rather than guessed.
 */
export function buildEventJsonLd(event: SeoEvent): WithContext<Event> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    url: buildEventUrl(event),
    ...(event.event_date ? { startDate: event.event_date } : {}),
    ...(event.description ? { description: event.description } : {}),
    ...(event.shop ? { location: buildEventPlace(event.shop) } : {}),
  }
}

export function buildNewsMetadata(update: SeoUpdate): Metadata {
  const title = `${update.title} | pgh.coffee`
  const description = update.description?.trim() || `${update.title} — Pittsburgh coffee news.`
  const path = buildNewsPath(update)

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, type: 'article', url: path },
    twitter: { card: 'summary', title, description },
  }
}

/**
 * Builds NewsArticle JSON-LD from real update data only. The canonical
 * `/news/{slug}` URL is used for both url and mainEntityOfPage; the external
 * source link (update.url) is intentionally not the canonical.
 */
export function buildNewsJsonLd(update: SeoUpdate): WithContext<NewsArticle> {
  const url = buildNewsUrl(update)

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: update.title,
    url,
    mainEntityOfPage: url,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    ...(update.post_date ? { datePublished: update.post_date } : {}),
    ...(update.description ? { description: update.description } : {}),
  }
}
