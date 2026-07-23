import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getAreaBySlug,
  buildAreaMetadata,
  buildAreaJsonLd,
  buildShopPath,
  jsonLdToString,
} from '@/app/utils/seo'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const area = await getAreaBySlug((await params).slug)
  return area ? buildAreaMetadata(area) : {}
}

export default async function NeighborhoodPage({ params }: Props) {
  const area = await getAreaBySlug((await params).slug)
  if (!area) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdToString(buildAreaJsonLd(area)) }} />
      <h1 className="text-3xl font-serif tracking-tight">Coffee shops in {area.area}</h1>
      <p className="mt-2 text-stone-600">
        {area.shops.length} independent coffee shops in {area.area}, Pittsburgh.
      </p>
      <ul className="mt-8 divide-y divide-stone-200">
        {area.shops.map(shop => (
          <li key={shop.uuid} className="py-4">
            <Link href={buildShopPath(shop)} className="text-lg font-medium underline underline-offset-2">
              {shop.name}
            </Link>
            <p className="text-sm text-stone-600">{shop.address}</p>
            {shop.description && <p className="mt-1 text-sm text-stone-500">{shop.description}</p>}
          </li>
        ))}
      </ul>
      <p className="mt-10 text-sm">
        <Link href="/neighborhoods" className="underline underline-offset-2">
          All neighborhoods
        </Link>{' '}
        ·{' '}
        <Link href="/" className="underline underline-offset-2">
          View the map
        </Link>
      </p>
    </div>
  )
}
