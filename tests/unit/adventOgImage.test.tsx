import { expect, test } from 'vitest'
import { NextRequest } from 'next/server'
import { expectPng } from '../helpers/ogImage'
import Image from '@/app/advent/opengraph-image'
import { GET } from '@/app/advent/[day]/og/route'

const dayImage = (day: string, query = '') =>
  GET(new NextRequest(`http://localhost/advent/${day}/og${query}`), { params: Promise.resolve({ day }) })

test('advent opengraph-image renders a PNG', async () => {
  await expectPng(Image())
}, 20_000)

test('day image renders a PNG', async () => {
  await expectPng(await dayImage('22', '?order=geo'))
}, 20_000)

test('day image 404s for a jar outside the calendar', async () => {
  expect((await dayImage('26')).status).toBe(404)
})
