import { describe, expect, it } from 'vitest'

// Importing the crawl script must not need .env.local or a Google key — the
// module used to read both at import, which also started a paid crawl.
describe('crawl-hours module safety', () => {
  it('imports and renders SQL without crawl credentials', async () => {
    const { renderSql } = await import('@/scripts/crawl-hours.mjs')

    const sql = renderSql([
      {
        shop: { uuid: 'abc-123', name: 'Test Roasters', neighborhood: 'Lawrenceville' },
        status: 'ok',
        placeId: 'place-1',
        dist: 12,
        matchName: 'Test Roasters',
        rows: [{ day: 1, open: '08:00', close: '17:00', spansMidnight: false }],
      },
    ])

    expect(sql).toContain('abc-123')
  })
})
