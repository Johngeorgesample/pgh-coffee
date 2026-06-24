import { describe, test, expect, vi } from 'vitest'

// seo.ts pulls in app/utils/shops.ts, which creates a Supabase client at module
// load. These tests only exercise pure helpers, so stub the client to avoid
// needing SUPABASE_URL in the test environment.
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({}),
}))

import {
  buildShopPath,
  buildShopUrl,
  parseAddress,
  jsonLdToString,
  buildShopJsonLd,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  buildShopListJsonLd,
  buildShopMetadata,
} from '@/app/utils/seo'
import { DbShop } from '@/types/shop-types'

const baseShop: DbShop = {
  name: '61B Cafe',
  neighborhood: 'Regent Square',
  address: '1108 S Braddock Ave, Pittsburgh, PA 15218',
  company: null,
  photo: 'https://uljutxoijtvtcxvatqso.supabase.co/storage/v1/object/public/shop-photos/regent_square/61b_cafe.jpg',
  photos: [],
  website: 'https://61bcafe.com/',
  uuid: '00000000-0000-0000-0000-000000000000',
  latitude: 40.432417,
  longitude: -79.893948,
}

describe('buildShopPath / buildShopUrl', () => {
  test('builds a /shops/{slug} path with the uuid8 suffix', () => {
    expect(buildShopPath(baseShop)).toBe('/shops/61b-cafe-regent-square-00000000')
  })

  test('produces an absolute, parseable URL', () => {
    const url = buildShopUrl(baseShop)
    expect(() => new URL(url)).not.toThrow()
    expect(url).toBe('https://pgh.coffee/shops/61b-cafe-regent-square-00000000')
  })
})

describe('parseAddress', () => {
  test('parses a standard "street, city, ST ZIP" address', () => {
    expect(parseAddress('1108 S Braddock Ave, Pittsburgh, PA 15218')).toEqual({
      streetAddress: '1108 S Braddock Ave',
      addressLocality: 'Pittsburgh',
      addressRegion: 'PA',
      postalCode: '15218',
    })
  })

  test('parses a ZIP+4 address', () => {
    expect(parseAddress('1 Main St, Pittsburgh, PA 15213-1234')?.postalCode).toBe('15213-1234')
  })

  test('returns null for addresses missing a comma before the city (no fabricated split)', () => {
    expect(parseAddress('522 E. Ohio St Pittsburgh, PA 15212')).toBeNull()
  })

  test('returns null for addresses with no recognizable state/ZIP', () => {
    expect(parseAddress('Somewhere downtown')).toBeNull()
  })
})

describe('jsonLdToString', () => {
  test('produces parseable JSON', () => {
    const data = { '@context': 'https://schema.org', '@type': 'Thing', name: 'Test' }
    expect(JSON.parse(jsonLdToString(data))).toEqual(data)
  })

  test('escapes "<" so a shop name cannot break out of the <script> tag', () => {
    const data = { name: '</script><script>alert(1)</script>' }
    const serialized = jsonLdToString(data)
    expect(serialized).not.toContain('</script>')
    expect(JSON.parse(serialized)).toEqual(data)
  })
})

describe('buildShopJsonLd', () => {
  test('includes only fields backed by real data for a fully-populated shop', () => {
    const jsonLd = buildShopJsonLd(baseShop)

    expect(jsonLd['@context']).toBe('https://schema.org')
    expect(jsonLd['@type']).toBe('CafeOrCoffeeShop')
    expect(jsonLd.name).toBe('61B Cafe')
    expect(jsonLd.address).toEqual({
      '@type': 'PostalAddress',
      streetAddress: '1108 S Braddock Ave',
      addressLocality: 'Pittsburgh',
      addressRegion: 'PA',
      postalCode: '15218',
      addressCountry: 'US',
    })
    expect(jsonLd.geo).toEqual({
      '@type': 'GeoCoordinates',
      latitude: 40.432417,
      longitude: -79.893948,
    })
    expect(jsonLd.image).toBe(baseShop.photo)
    expect(jsonLd.url).toBe(baseShop.website)
    // round-trips through JSON
    expect(() => JSON.parse(jsonLdToString(jsonLd))).not.toThrow()
  })

  test('omits address when the source address has no comma before the city', () => {
    const shop: DbShop = { ...baseShop, address: '522 E. Ohio St Pittsburgh, PA 15212' }
    expect(buildShopJsonLd(shop).address).toBeUndefined()
  })

  test('omits image when photo is null', () => {
    const shop: DbShop = { ...baseShop, photo: null }
    expect(buildShopJsonLd(shop).image).toBeUndefined()
  })

  test('omits url when website is empty', () => {
    const shop: DbShop = { ...baseShop, website: '' }
    expect(buildShopJsonLd(shop).url).toBeUndefined()
  })

  test('omits sameAs when there is no linked company', () => {
    expect(buildShopJsonLd(baseShop).sameAs).toBeUndefined()
  })

  test('builds sameAs from company website and instagram handle when present', () => {
    const shop: DbShop = {
      ...baseShop,
      company: {
        id: 'c1',
        slug: 'some-co',
        name: 'Some Co',
        website: 'https://someco.example',
        description: '',
        instagram_handle: '@someco',
      },
    }
    expect(buildShopJsonLd(shop).sameAs).toEqual(['https://someco.example', 'https://www.instagram.com/someco/'])
  })
})

describe('buildOrganizationJsonLd / buildWebsiteJsonLd', () => {
  test('produce valid, parseable top-level JSON-LD', () => {
    const org = buildOrganizationJsonLd()
    expect(org['@context']).toBe('https://schema.org')
    expect(org['@type']).toBe('Organization')
    expect(org.url).toBe('https://pgh.coffee')
    expect(() => JSON.parse(jsonLdToString(org))).not.toThrow()

    const site = buildWebsiteJsonLd()
    expect(site['@context']).toBe('https://schema.org')
    expect(site['@type']).toBe('WebSite')
    expect(() => JSON.parse(jsonLdToString(site))).not.toThrow()
  })
})

describe('buildShopListJsonLd', () => {
  test('builds a CollectionPage with one ListItem per shop, 1-indexed', () => {
    const entries = [
      { name: '61B Cafe', neighborhood: 'Regent Square', uuid: '00000000-0000-0000-0000-000000000000' },
      { name: 'Afters Cafe', neighborhood: 'Squirrel Hill South', uuid: '11111111-1111-1111-1111-111111111111' },
    ]
    const jsonLd = buildShopListJsonLd(entries)

    expect(jsonLd['@type']).toBe('CollectionPage')
    const itemList = jsonLd.mainEntity as unknown as { '@type': string; itemListElement: { position: number; name: string; url: string }[] }
    expect(itemList['@type']).toBe('ItemList')
    expect(itemList.itemListElement).toHaveLength(2)
    expect(itemList.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: '61B Cafe',
      url: buildShopUrl(entries[0]),
    })
    expect(itemList.itemListElement[1].position).toBe(2)
  })
})

describe('buildShopMetadata', () => {
  test('sets OG and Twitter fields from real shop data', () => {
    const metadata = buildShopMetadata(baseShop)

    expect(metadata.title).toBe('61B Cafe | Regent Square | pgh.coffee')
    expect(metadata.alternates?.canonical).toBe('/shops/61b-cafe-regent-square-00000000')
    expect(metadata.openGraph?.url).toBe('/shops/61b-cafe-regent-square-00000000')
    expect(metadata.openGraph?.images).toEqual([{ url: baseShop.photo }])
    const twitter = metadata.twitter as { card?: string; images?: unknown } | undefined
    expect(twitter?.card).toBe('summary_large_image')
    expect(twitter?.images).toEqual([baseShop.photo])
  })

  test('omits image fields when the shop has no photo, allowing site default to be inherited', () => {
    const shop: DbShop = { ...baseShop, photo: null }
    const metadata = buildShopMetadata(shop)
    const twitter = metadata.twitter as { card?: string; images?: unknown } | undefined

    expect(metadata.openGraph?.images).toBeUndefined()
    expect(twitter?.images).toBeUndefined()
    expect(twitter?.card).toBeUndefined()
  })
})
