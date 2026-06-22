import { describe, test, expect } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'

// Guards against the bug fixed alongside this test: an endpoint whose response
// body varies by query string must NOT carry a shared-CDN cache header. The CDN
// keys its cache on the path alone, so caching `/api/events` would serve one
// shop's (or the unfiltered) event list for every `?shop_id=` request.
//
// "Varies by query string" is detected as reading `searchParams`; "shared-CDN
// cache" as using `publicCacheHeaders` / emitting `s-maxage`. Path-param routes
// (e.g. `/api/roasters/[slug]`) and no-param list routes stay cacheable because
// their bodies don't depend on the query string.

const API_DIR = join(process.cwd(), 'app', 'api')

const routeFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap(entry => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return routeFiles(full)
    return /^route\.tsx?$/.test(entry) ? [full] : []
  })

const variesByQuery = (src: string) => src.includes('searchParams')
const isSharedCached = (src: string) => /publicCacheHeaders|s-maxage/.test(src)

describe('CDN cache safety invariant', () => {
  test('no API route both varies by query string and sets a shared-CDN cache header', () => {
    const offenders = routeFiles(API_DIR).filter(file => {
      const src = readFileSync(file, 'utf8')
      return variesByQuery(src) && isSharedCached(src)
    })

    expect(
      offenders,
      `These routes vary their body by the query string but emit a shared-CDN cache ` +
        `header. The CDN keys on path only, so cached responses leak across query ` +
        `values. Remove the shared-cache header (or move the filter into the path):\n` +
        offenders.map(f => `  - ${f.replace(process.cwd() + '/', '')}`).join('\n'),
    ).toEqual([])
  })
})
