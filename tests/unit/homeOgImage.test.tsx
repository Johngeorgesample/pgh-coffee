import { describe, test } from 'vitest'
import Image from '@/app/opengraph-image'
import { expectPng } from '../helpers/ogImage'

describe('home opengraph-image', () => {
  test('renders a PNG', async () => {
    await expectPng(await Image())
  })
})
