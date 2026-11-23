import { describe, test, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { insertHours, metaUpsert, stripLeadingSqlComment } from '@/scripts/lib/sql.mjs'

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

describe('hours writes', () => {
  const uuid = '11111111-1111-1111-1111-111111111111'

  test('never inserts Google hours for a shop whose hours are owned by another source', () => {
    const sql = insertHours(uuid, [{ day: 1, opens: '07:00', closes: '14:00', spans: false }])

    expect(sql).toContain("m.source <> 'google_places'")
  })

  test('keeps the old fetched_at when a failed lookup leaves the old hours in place', () => {
    const onConflict = (hoursReplaced: boolean) => metaUpsert(uuid, 'ok', 'p1', 5, hoursReplaced).split('ON CONFLICT')[1]

    expect(onConflict(false)).not.toContain('fetched_at')
    expect(onConflict(true)).toContain('fetched_at')
  })
})
