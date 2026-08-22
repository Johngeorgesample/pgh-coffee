import { describe, test, expect, beforeAll, vi } from 'vitest'

// lib/capture builds a Supabase client at import time; getSourceUrl itself
// touches neither Supabase nor Anthropic.
vi.stubEnv('SUPABASE_URL', 'http://localhost:54321')
vi.stubEnv('SUPABASE_ANON_KEY', 'test-anon-key')

let getSourceUrl: typeof import('@/lib/capture').getSourceUrl

const requestWith = (query: string) => new Request(`http://localhost/api/events/capture${query}`)

describe('getSourceUrl', () => {
  beforeAll(async () => {
    getSourceUrl = (await import('@/lib/capture')).getSourceUrl
  })

  test('reads the Instagram permalink the Shortcut appends', () => {
    expect(getSourceUrl(requestWith('?url=https%3A%2F%2Fwww.instagram.com%2Fp%2FDZFeVUlurOU%2F')))
      .toBe('https://www.instagram.com/p/DZFeVUlurOU/')
  })

  // Shortcuts builds the URL by concatenating text, so the permalink arrives raw.
  test('reads an unencoded permalink', () => {
    expect(getSourceUrl(requestWith('?url=https://www.instagram.com/p/DZFeVUlurOU/')))
      .toBe('https://www.instagram.com/p/DZFeVUlurOU/')
  })

  test('is null when the Shortcut sends no url', () => {
    expect(getSourceUrl(requestWith(''))).toBeNull()
  })

  test('rejects a non-https value rather than storing it', () => {
    expect(getSourceUrl(requestWith('?url=javascript%3Aalert(1)'))).toBeNull()
  })
})
