import type { Metadata } from 'next'
import Link from 'next/link'
import { getNeighborhoodAreas } from '@/app/utils/seo'
import { areaPath } from '@/app/utils/neighborhoodAreas'

export const metadata: Metadata = {
  title: 'Coffee shops by neighborhood | pgh.coffee',
  description: 'Independent Pittsburgh coffee shops, organized by neighborhood.',
  alternates: { canonical: '/neighborhoods' },
}

export default async function NeighborhoodsPage() {
  const areas = await getNeighborhoodAreas()

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-serif tracking-tight">Coffee shops by neighborhood</h1>
      <ul className="mt-8 space-y-3">
        {areas.map(({ area, shops }) => (
          <li key={area}>
            <Link href={areaPath(area)} className="text-lg underline underline-offset-2">
              {area}
            </Link>
            <span className="ml-2 text-sm text-stone-500">{shops.length} shops</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
