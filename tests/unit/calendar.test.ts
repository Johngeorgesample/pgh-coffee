import { describe, expect, it } from 'vitest'
import { buildICS } from '@/app/utils/calendar'

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
