import { test } from 'vitest'
import { expectPng } from '../helpers/ogImage'
import Image from '@/app/advent/opengraph-image'

test('advent opengraph-image renders a PNG', async () => {
  await expectPng(Image())
})
