import { cache } from 'react'
import type { Metadata } from 'next'
import type { CafeOrCoffeeShopLeaf, CollectionPageLeaf, OrganizationLeaf, WebSite, WithContext } from 'schema-dts'
import { DbShop } from '@/types/shop-types'
import { logger } from '@/lib/logger'
import { buildShopSlug, extractUuidPrefix, slugify } from '@/app/utils/shopSlug'
import { areaPath, groupShopsIntoAreas, shopNoun } from '@/app/utils/neighborhoodAreas'
import { getShopByUuidPrefix } from '@/app/utils/shops'
import { getClient } from '@/lib/supabase/server-client'

export const SITE_URL = 'https://pgh.coffee'
export const SITE_NAME = 'pgh.coffee'


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
  address: string
  description: string | null
  photo: string | null
  verified: boolean
  latitude: number | null
  longitude: number | null
}

/**
 * Fetches every shop's name, neighborhood, and uuid for building the sitemap and
 * the shop-list JSON-LD. No deduping is needed: each shop has its own
 * `/shops/{slug}` URL (the uuid suffix keeps same-name locations distinct).
 */
export const getAllShopsForSeo = cache(async (): Promise<ShopListEntry[]> => {
  const supabase = getClient()
  const { data, error } = await supabase
    .from('shops')
    .select(
      'name, neighborhood, uuid, address, description, photo, latitude, longitude, is_verified, company:company_id(is_verified)'
    )
    .order('name', { ascending: true })

  if (error || !data) {
    if (error) logger.error('Error fetching shops for SEO', { error: error.message })
    return []
  }

  // A shop shows the badge when it's claimed directly or its company is
  // verified — the same rule PanelHeader/ShopCard apply on the client.
  return data.map(({ is_verified, company, ...shop }) => ({
    ...shop,
    verified: Boolean(is_verified || (company as { is_verified?: boolean } | null)?.is_verified),
  })) as ShopListEntry[]
})

/**
 * Builds OG/Twitter metadata for a shop page from real shop data. Now that shops
 * live at a real `/shops/{slug}` path, canonical/og:url are expressed through the
 * metadata API (resolved against metadataBase in the root layout).
 * No images here: the sibling opengraph-image.tsx supplies og:image for every
 * shop, photo-less ones included, so the card is always branded rather than a
 * bare storefront photo cropped to whatever the crawler decides.
 */
export function buildShopMetadata(shop: DbShop): Metadata {
  const title = `${shop.name} | ${shop.neighborhood} | pgh.coffee`
  const description =
    shop.description?.trim() ||
    `${shop.name} is an independent coffee shop in ${shop.neighborhood}, Pittsburgh — ${shop.address}.`
  const path = buildShopPath(shop)

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      siteName: SITE_NAME,
      title,
      description,
      type: 'website',
      url: path,
    },
    // No twitter object: the layout's { card: 'summary_large_image' } is
    // inherited and X falls back to these og:* tags for title/description/image.
  }
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

export interface NeighborhoodArea {
  area: string
  shops: ShopListEntry[]
}

export const getNeighborhoodAreas = cache(async (): Promise<NeighborhoodArea[]> => {
  return groupShopsIntoAreas(await getAllShopsForSeo())
})

export const getAreaBySlug = cache(async (slug: string): Promise<NeighborhoodArea | null> => {
  const areas = await getNeighborhoodAreas()
  return areas.find(({ area }) => slugify(area) === slug) ?? null
})

export function buildAreaMetadata({ area, shops }: NeighborhoodArea): Metadata {
  const title = `Coffee shops in ${area} | pgh.coffee`
  const description = `${shops.length} independent coffee ${shopNoun(shops.length)} in ${area}, Pittsburgh — an up-to-date local guide with addresses and a map for each.`
  const path = areaPath(area)

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, type: 'website', url: path },
    twitter: { title, description },
  }
}

export function buildAreaJsonLd({ area, shops }: NeighborhoodArea): WithContext<CollectionPageLeaf> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Coffee shops in ${area}`,
    url: `${SITE_URL}${areaPath(area)}`,
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
