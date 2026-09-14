import { describe, expect, it } from 'vitest'

// The crawl script used to read .env.local and start a paid Google crawl at
// import, so this exercises renderSql with neither present.
describe('crawl-hours renderSql', () => {
  it('emits an hours row without needing crawl credentials', async () => {
    const { renderSql } = await import('@/scripts/crawl-hours.mjs')

    const sql = renderSql([
      {
        shop: { uuid: 'abc-123', name: 'Test Roasters', neighborhood: 'Lawrenceville' },
        status: 'ok',
        placeId: 'place-1',
        dist: 12,
        matchName: 'Test Roasters',
        rows: [
          { day: 1, opens: '08:00', closes: '17:00', spans: false },
          { day: 2, opens: '20:00', closes: '02:00', spans: true },
        ],
      },
    ])

    expect(sql).toContain("('abc-123', 1, '08:00', '17:00', false)")
    expect(sql).toContain("('abc-123', 2, '20:00', '02:00', true)")
    expect(sql).not.toContain('undefined')
  })
})
