import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'
import type { CafeOrCoffeeShopLeaf, CollectionPageLeaf, OrganizationLeaf, WebSite, WithContext } from 'schema-dts'
import { DbShop } from '@/types/shop-types'
import { logger } from '@/lib/logger'

export const SITE_URL = 'https://pgh.coffee'
export const SITE_NAME = 'pgh.coffee'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string

/**
 * Builds the `/?shop=...` path for a shop, matching the encoding produced by
 * useShopSelection's appendSearchParamToURL so canonical/OG URLs match the
 * links the app itself generates.
 */
export function buildShopPath(name: string, neighborhood: string): string {
  const params = new URLSearchParams()
  params.set('shop', `${name}_${neighborhood}`)
  return `/?${params.toString()}`
}

export function buildShopUrl(name: string, neighborhood: string): string {
  return `${SITE_URL}${buildShopPath(name, neighborhood)}`
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
 * Fetches a single shop by name + neighborhood for SEO purposes. Wrapped in
 * React's cache() so generateMetadata and the page body share one query per request.
 */
export const getShopForSeo = cache(async (name: string, neighborhood: string): Promise<DbShop | null> => {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('shops')
    .select('*, company:company_id(*)')
    .eq('name', name)
    .eq('neighborhood', neighborhood)

  if (error) {
    logger.error('Error fetching shop for SEO', { error: error.message })
    return null
  }

  if (!data || data.length === 0) return null
  return data[0]
})

export type SearchParams = { [key: string]: string | string[] | undefined }

/**
 * Resolves the shop referenced by a `?shop={name}_{neighborhood}` search param,
 * or null if absent/unrecognized. Shared by generateMetadata and the page body
 * so both agree on which shop (if any) the page is about.
 */
export async function getShopFromSearchParams(searchParams: SearchParams): Promise<DbShop | null> {
  const shopParam = searchParams.shop
  if (!shopParam || typeof shopParam !== 'string') return null

  const [name, neighborhood] = shopParam.split('_')
  if (!name || !neighborhood) return null

  return getShopForSeo(name, neighborhood)
}

export interface ShopListEntry {
  name: string
  neighborhood: string
}

/**
 * Fetches every shop's name + neighborhood, deduped to one entry per
 * /?shop= identifier (e.g. the three "Yinz Coffee" locations in Downtown
 * collapse to a single URL).
 */
export const getAllShopsForSeo = cache(async (): Promise<ShopListEntry[]> => {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('shops')
    .select('name, neighborhood')
    .order('name', { ascending: true })

  if (error || !data) {
    if (error) logger.error('Error fetching shops for SEO', { error: error.message })
    return []
  }

  const seen = new Set<string>()
  return data.filter(shop => {
    const key = `${shop.name}_${shop.neighborhood}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
})

/**
 * Builds OG/Twitter metadata for a shop page from real shop data.
 * Image/photo fields are only set when present; otherwise the root layout's
 * site-default image is inherited via Next's metadata merging.
 *
 * canonical/og:url are deliberately omitted here: shop pages live at `/?shop=...`,
 * and Next's metadata resolver collapses any absolute URL whose pathname is "/"
 * down to the bare origin, discarding the query string. Returning a per-shop URL
 * would render as `https://pgh.coffee` — i.e. "this page is a duplicate of the
 * homepage", which is worse than no canonical at all. The page body renders its
 * own correct <link rel="canonical"> and <meta property="og:url"> tags instead.
 */
export function buildShopMetadata(shop: DbShop): Metadata {
  const title = `${shop.name} | ${shop.neighborhood} | pgh.coffee`
  const description = `${shop.name} is an independent coffee shop in ${shop.neighborhood}, Pittsburgh — ${shop.address}.`

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
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
        url: buildShopUrl(shop.name, shop.neighborhood),
      })),
    },
  }
}
