import { describe, test, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { renderSql, stripLeadingSqlComment } from '@/scripts/lib/sql.mjs'

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

describe('stripLeadingSqlComment', () => {
  test('drops a leading prose header, keeping the DDL and its trailing inline comment', () => {
    const input = [
      '-- Schema for the shop hours-of-operation feature.',
      '--',
      '-- Apply by hand. See the generated hours-backfill.sql for data.',
      '',
      "CREATE TABLE IF NOT EXISTS shop_hours (id uuid PRIMARY KEY);",
      '-- No policies: admin/service-role only.',
    ].join('\n')

    expect(stripLeadingSqlComment(input)).toBe(
      [
        'CREATE TABLE IF NOT EXISTS shop_hours (id uuid PRIMARY KEY);',
        '-- No policies: admin/service-role only.',
      ].join('\n'),
    )
  })

  test('returns the input unchanged when there is no leading comment', () => {
    expect(stripLeadingSqlComment('CREATE TABLE foo (id uuid);')).toBe('CREATE TABLE foo (id uuid);')
  })

  test('throws rather than silently returning no DDL when the input is all comments', () => {
    expect(() => stripLeadingSqlComment('-- just a comment\n-- another line')).toThrow()
  })

  test('strips the real hours-schema.sql header down to just its CREATE TABLE statements', () => {
    const schema = readFileSync(join(REPO_ROOT, 'migrations', 'hours-schema.sql'), 'utf8')

    const result = stripLeadingSqlComment(schema)

    expect(result.startsWith('CREATE TABLE IF NOT EXISTS shop_hours (')).toBe(true)
    expect(result).not.toContain('hours-backfill.sql')
    expect(result).toContain('CREATE TABLE IF NOT EXISTS shop_hours_meta (')
    expect(result.trimEnd().endsWith("-- No policies: admin/service-role only (not readable/writable by anon).")).toBe(true)
  })
})

describe('renderSql', () => {
  const shop = { uuid: '11111111-1111-1111-1111-111111111111', name: 'Test', neighborhood: 'Downtown' }
  const result = (status: string, rows: object[] = []) => ({ shop, status, placeId: 'p1', dist: 5, matchName: 'Test', rows })
  const statements = (sql: string) => sql.split(/;\n/)

  test('never inserts Google hours for a shop whose hours are owned by another source', () => {
    const sql = renderSql([result('ok', [{ day: 1, opens: '07:00', closes: '14:00', spans: false }])], 'CREATE TABLE x ();')

    const insert = statements(sql).find(s => s.includes('INSERT INTO shop_hours ('))

    expect(insert).toContain("m.source <> 'google_places'")
  })

  test('reads the hours tables only after the migration that creates them', () => {
    const sql = renderSql([], 'CREATE TABLE x ();')

    expect(sql.indexOf('CREATE TABLE x ();')).toBeLessThan(sql.indexOf('FROM shop_hours'))
  })

  test('keeps the old fetched_at when a failed crawl leaves the old hours in place', () => {
    const upsert = (status: string) => renderSql([result(status)], '').split('ON CONFLICT')[1].split(';')[0]

    expect(upsert('error')).not.toContain('fetched_at')
    expect(upsert('no_hours')).toContain('fetched_at')
  })
})
