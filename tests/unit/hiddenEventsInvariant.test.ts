import { describe, test, expect } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'

// Guards against the bug fixed alongside this test: `events.is_hidden` is the
// moderation gate, but the RLS policy on the table is `SELECT USING (true)`, so
// the filter is enforced only in application code. It had been applied in one of
// four read paths — hiding an event dropped it from the list while leaving it
// fully readable at its permanent `/events/{slug}` URL.
//
// Every read now goes through `visibleEvents()` in app/utils/events.ts, which
// applies the filter once. This test fails if a new caller selects from `events`
// directly and re-opens the hole. Inserts are exempt: the capture pipeline
// writes to the table and has nothing to filter.

const SEARCH_DIRS = ['app', 'lib'].map(d => join(process.cwd(), d))
const GATE = join('app', 'utils', 'events.ts')

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap(entry => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return /\.tsx?$/.test(entry) ? [full] : []
  })

describe('hidden events invariant', () => {
  test('only the shared gate selects from the events table', () => {
    const offenders = SEARCH_DIRS.flatMap(sourceFiles)
      .filter(file => !file.endsWith(GATE))
      .filter(file => {
        const src = readFileSync(file, 'utf8')
        return /\.from\(['"]events['"]\)/.test(src) && /\.select\(/.test(src)
      })

    expect(
      offenders,
      `These files query the events table directly, bypassing the is_hidden ` +
        `filter — hidden events would be served to anyone with the URL. Use ` +
        `visibleEvents() from app/utils/events.ts instead:\n` +
        offenders.map(f => `  - ${f.replace(process.cwd() + '/', '')}`).join('\n'),
    ).toEqual([])
  })
})
