import { describe, test, expect, vi } from 'vitest'

// seo.ts transitively creates Supabase clients at module load; these tests only
// exercise pure builders, so stub the client (matching seo.test.ts).
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({}),
}))

import {
  buildEventPath,
  buildEventUrl,
  buildNewsUrl,
  buildEventMetadata,
  buildEventJsonLd,
  buildNewsMetadata,
  buildNewsJsonLd,
  jsonLdToString,
  type SeoEvent,
  type SeoUpdate,
} from '@/app/utils/seo'

const baseEvent: SeoEvent = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  title: 'Latte Art Throwdown',
  description: 'A friendly competition.',
  url: 'https://example.com/throwdown',
  event_date: '2026-07-01',
  shop: {
    name: '61B Cafe',
    neighborhood: 'Regent Square',
    address: '1108 S Braddock Ave, Pittsburgh, PA 15218',
    latitude: 40.432417,
    longitude: -79.893948,
  },
}

const baseUpdate: SeoUpdate = {
  id: 'deadbeef-0000-1111-2222-333344445555',
  title: 'New Roaster Opens in Lawrenceville',
  description: 'Details inside.',
  url: 'https://example.com/source',
  post_date: '2026-06-10',
}

describe('event/news URL builders', () => {
  test('build /events and /news paths with the title-id8 slug', () => {
    expect(buildEventPath(baseEvent)).toBe('/events/latte-art-throwdown-a1b2c3d4')
    expect(buildEventUrl(baseEvent)).toBe('https://pgh.coffee/events/latte-art-throwdown-a1b2c3d4')
    expect(buildNewsUrl(baseUpdate)).toBe('https://pgh.coffee/news/new-roaster-opens-in-lawrenceville-deadbeef')
  })
})

describe('buildEventMetadata', () => {
  test('sets a canonical and og:url pointing at the event path', () => {
    const meta = buildEventMetadata(baseEvent)
    expect(meta.alternates?.canonical).toBe('/events/latte-art-throwdown-a1b2c3d4')
    expect(meta.openGraph?.url).toBe('/events/latte-art-throwdown-a1b2c3d4')
  })

  test('falls back to a generated description that names the shop when none is set', () => {
    const meta = buildEventMetadata({ ...baseEvent, description: null })
    expect(meta.description).toBe('Latte Art Throwdown at 61B Cafe — a coffee event in Pittsburgh.')
  })
})

describe('buildEventJsonLd', () => {
  test('includes startDate and a Place location with parsed address + geo', () => {
    const jsonLd = buildEventJsonLd(baseEvent)
    expect(jsonLd['@type']).toBe('Event')
    expect(jsonLd.startDate).toBe('2026-07-01')
    const place = jsonLd.location as { '@type': string; name: string; address: { postalCode: string }; geo: { latitude: number } }
    expect(place['@type']).toBe('Place')
    expect(place.name).toBe('61B Cafe')
    expect(place.address.postalCode).toBe('15218')
    expect(place.geo.latitude).toBe(40.432417)
    expect(() => JSON.parse(jsonLdToString(jsonLd))).not.toThrow()
  })

  test('omits startDate and location when there is no date or shop', () => {
    const jsonLd = buildEventJsonLd({ id: baseEvent.id, title: baseEvent.title })
    expect(jsonLd.startDate).toBeUndefined()
    expect(jsonLd.location).toBeUndefined()
  })
})

describe('buildNewsMetadata / buildNewsJsonLd', () => {
  test('metadata canonicalizes to the news path', () => {
    expect(buildNewsMetadata(baseUpdate).alternates?.canonical).toBe(
      '/news/new-roaster-opens-in-lawrenceville-deadbeef',
    )
  })

  test('NewsArticle uses the canonical url for url + mainEntityOfPage, not the source link', () => {
    const jsonLd = buildNewsJsonLd(baseUpdate)
    const canonical = 'https://pgh.coffee/news/new-roaster-opens-in-lawrenceville-deadbeef'
    expect(jsonLd['@type']).toBe('NewsArticle')
    expect(jsonLd.headline).toBe(baseUpdate.title)
    expect(jsonLd.url).toBe(canonical)
    expect(jsonLd.mainEntityOfPage).toBe(canonical)
    expect(jsonLd.datePublished).toBe('2026-06-10')
  })

  test('omits datePublished when post_date is missing', () => {
    expect(buildNewsJsonLd({ id: baseUpdate.id, title: baseUpdate.title }).datePublished).toBeUndefined()
  })
})
