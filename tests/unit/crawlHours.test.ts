// The compact SQL is what actually gets applied, so what matters is that it
// writes the same thing as the reviewable file it's derived from. These compare
// the two renderers' effects rather than their text.
// @ts-expect-error - plain .mjs script, no types
import { renderSql, renderCompactSql } from '@/scripts/crawl-hours.mjs'

const uuid = (n: number) => `${String(n).repeat(8)}-1111-1111-1111-111111111111`

const result = (n: number, status: string, rows: unknown[] = []) => ({
  shop: { uuid: uuid(n), name: `Shop ${n}`, neighborhood: 'Bloomfield' },
  status,
  placeId: status === 'not_found' ? null : `place-${n}`,
  dist: 10,
  matchName: `Shop ${n}`,
  rows,
})

const results = [
  result(1, 'ok', [
    { day: 0, opens: '08:00', closes: '17:00', spans: false },
    { day: 1, opens: '09:00', closes: '18:00', spans: false },
  ]),
  result(2, 'no_hours'),
  result(3, 'not_found'),
  result(4, 'low_confidence'),
  result(5, 'ok', [{ day: 6, opens: '07:00', closes: '23:30', spans: true }]),
]

const UUID_PATTERN = /[0-9a-f]{8}-1111-1111-1111-111111111111/g
const uuidsIn = (sql: string) => new Set(sql.match(UUID_PATTERN) ?? [])
const withoutCasts = (sql: string) => sql.replace(/::\w+( precision)?/g, '')

const hoursRows = (sql: string) =>
  (
    withoutCasts(sql).match(
      /\('[0-9a-f-]+', ?\d, ?'\d\d:\d\d', ?'\d\d:\d\d', ?(?:true|false)\)/g,
    ) ?? []
  )
    .map(row => row.replace(/\s+/g, ''))
    .sort()

const metaUuids = (sql: string) => uuidsIn(sql.slice(sql.indexOf('INSERT INTO shop_hours_meta')))

describe('crawl-hours SQL renderers', () => {
  const long: string = renderSql(results)
  const compact: string = renderCompactSql(results)

  it('clears hours for the same shops in both forms', () => {
    const perShopDeletes = long.match(/DELETE FROM shop_hours WHERE shop_uuid = '[^']+'/g) ?? []
    const compactDeletes = compact.match(/DELETE FROM shop_hours WHERE shop_uuid IN \(([^)]*)\)/)

    // no_hours shops are cleared but never repopulated — Google dropped their
    // hours, so leaving the old rows would keep a wrong schedule on the site.
    expect(uuidsIn(compactDeletes![1])).toEqual(uuidsIn(perShopDeletes.join(' ')))
    expect(uuidsIn(compactDeletes![1]).size).toBe(3)
  })

  it('inserts the same hours rows in both forms', () => {
    expect(hoursRows(compact)).toEqual(hoursRows(long))
    expect(hoursRows(compact)).toHaveLength(3)
  })

  it('records provenance for every shop, whatever its status', () => {
    expect(metaUuids(compact)).toEqual(metaUuids(long))
    expect(metaUuids(compact).size).toBe(results.length)
  })
})
