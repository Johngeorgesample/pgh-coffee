import { describe, test, expect } from 'vitest'
import { buildContentSlug, extractUuidPrefix } from '@/app/utils/slug'

describe('buildContentSlug', () => {
  test('combines a slugified title with the first 8 chars of the id', () => {
    const slug = buildContentSlug({ title: 'Latte Art Throwdown!', id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
    expect(slug).toBe('latte-art-throwdown-a1b2c3d4')
  })

  test('round-trips: the slug it builds yields the id prefix back', () => {
    const id = 'deadbeef-0000-1111-2222-333344445555'
    const slug = buildContentSlug({ title: 'Some Event', id })
    expect(extractUuidPrefix(slug)).toBe(id.slice(0, 8))
  })
})
