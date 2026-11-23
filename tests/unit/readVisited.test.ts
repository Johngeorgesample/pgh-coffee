import { afterEach, expect, test } from 'vitest'
import { readVisited } from '@/app/components/advent/MarkVisited'

afterEach(() => localStorage.clear())

test.each(['not json', '{}', 'null'])('falls back to no visits when storage holds %j', (stored) => {
  localStorage.setItem('advent:visited', stored)
  expect(readVisited()).toEqual([])
})
