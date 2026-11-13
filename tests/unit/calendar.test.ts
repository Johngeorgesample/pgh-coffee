import { describe, expect, it } from 'vitest'
import { buildGoogleCalendarUrl, buildICS } from '@/app/utils/calendar'

describe('buildICS', () => {
  it('leaves no bare carriage returns inside a multi-line description', () => {
    const ics = buildICS({
      id: 'abc',
      title: 'Cupping',
      event_date: '2026-11-21',
      description: 'CRLF line\r\nCR line\rLF line\nend',
    })

    const description = ics.split('\r\n').find(line => line.startsWith('DESCRIPTION:'))
    expect(description).toBe('DESCRIPTION:CRLF line\\nCR line\\nLF line\\nend')
  })
})

describe('buildICS location', () => {
  const event = { id: 'abc', title: 'Moka Pot Party', event_date: '2026-11-21' }
  const shop = { name: 'La Prima', neighborhood: 'Strip District', uuid: 'u' }
  const roaster = { name: '19 Coffee', slug: '19-coffee' }
  const locationOf = (ics: string) => ics.split('\r\n').find(line => line.startsWith('LOCATION:'))

  it('prefers a street address found in the description over the shop', () => {
    const ics = buildICS({
      ...event,
      shop,
      description: 'Starts 10:30 PM at 19 Coffee HQ (5171 Brownsville Rd, Pittsburgh, PA 15236).',
    })
    expect(locationOf(ics)).toBe('LOCATION:5171 Brownsville Rd\\, Pittsburgh\\, PA 15236')
  })

  it('falls back to the shop, then the roaster', () => {
    expect(locationOf(buildICS({ ...event, shop, roaster }))).toBe('LOCATION:La Prima\\, Strip District\\, Pittsburgh\\, PA')
    expect(locationOf(buildICS({ ...event, roaster }))).toBe('LOCATION:19 Coffee')
  })
})

describe('buildICS line folding', () => {
  it('keeps every line within 75 bytes and unfolds back to the original', () => {
    const description = 'Moka pot tasting 10am–12pm. '.repeat(20).trim()
    const ics = buildICS({ id: 'abc', title: 'Cupping', event_date: '2026-11-21', description })

    const lines = ics.split('\r\n')
    expect(Math.max(...lines.map(line => new TextEncoder().encode(line).length))).toBeLessThanOrEqual(75)

    const unfolded = ics.replace(/\r\n /g, '').split('\r\n')
    expect(unfolded).toContain(`DESCRIPTION:${description}`)
  })
})

describe('buildGoogleCalendarUrl', () => {
  it('builds an all-day entry that ends the next day, across a year boundary', () => {
    const url = new URL(buildGoogleCalendarUrl({
      id: 'abc',
      title: 'New Year Cupping & Brunch',
      event_date: '2026-12-31',
      description: 'Bring a mug.',
      url: 'https://example.com/cupping',
      shop: { name: 'La Prima', neighborhood: 'Strip District', uuid: 'u' },
    }))
    const params = Object.fromEntries(url.searchParams)

    expect(url.origin + url.pathname).toBe('https://calendar.google.com/calendar/render')
    expect(params).toEqual({
      action: 'TEMPLATE',
      text: 'New Year Cupping & Brunch',
      dates: '20261231/20270101',
      details: 'Bring a mug.\n\nhttps://example.com/cupping',
      location: 'La Prima, Strip District, Pittsburgh, PA',
    })
  })

  it('returns nothing for an event without a date', () => {
    expect(buildGoogleCalendarUrl({ id: 'abc', title: 'TBD' })).toBe('')
  })
})

describe('timed events', () => {
  const event = { id: 'abc', title: 'Moka Pot Party', event_date: '2026-11-21', start_time: '10:00:00', end_time: '12:00:00' }
  const datesOf = (e: Parameters<typeof buildGoogleCalendarUrl>[0]) => new URL(buildGoogleCalendarUrl(e)).searchParams.get('dates')

  it('converts Pittsburgh local time to UTC across standard and daylight time', () => {
    expect(datesOf(event)).toBe('20261121T150000Z/20261121T170000Z')
    expect(datesOf({ ...event, event_date: '2026-07-04' })).toBe('20260704T140000Z/20260704T160000Z')
  })

  it('defaults to one hour when there is no end time', () => {
    expect(datesOf({ ...event, end_time: null })).toBe('20261121T150000Z/20261121T160000Z')
  })

  it('writes timed DTSTART/DTEND to the .ics', () => {
    const lines = buildICS(event).split('\r\n')
    expect(lines).toContain('DTSTART:20261121T150000Z')
    expect(lines).toContain('DTEND:20261121T170000Z')
  })
})
