import { describe, test, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { stripLeadingSqlComment } from '@/scripts/lib/sql.mjs'

// Anchored to this test file's location, not process.cwd(), so it resolves
// the same regardless of which directory vitest is invoked from — matching
// how crawl-hours.mjs itself resolves ROOT.
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

  // Regression for S20: crawl-hours.mjs embeds this file's DDL directly into
  // a generated review file, so the schema's own "see the generated file"
  // header must not leak into that generated file's contents, and nothing in
  // the DDL itself should get dropped along with the header.
  test('strips the real hours-schema.sql header down to just its CREATE TABLE statements', () => {
    const schema = readFileSync(join(REPO_ROOT, 'migrations', 'hours-schema.sql'), 'utf8')

    const result = stripLeadingSqlComment(schema)

    expect(result.startsWith('CREATE TABLE IF NOT EXISTS shop_hours (')).toBe(true)
    expect(result).not.toContain('hours-backfill.sql')
    expect(result).toContain('CREATE TABLE IF NOT EXISTS shop_hours_meta (')
    expect(result.trimEnd().endsWith("-- No policies: admin/service-role only (not readable/writable by anon).")).toBe(true)
  })
})
