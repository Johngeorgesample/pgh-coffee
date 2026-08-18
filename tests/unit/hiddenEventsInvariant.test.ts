import { describe, test, expect } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'

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
