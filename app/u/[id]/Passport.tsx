'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDBShopAsFeature } from '@/app/utils/utils'
import { buildShopSlug } from '@/app/utils/shopSlug'
import type { Visit } from '@/app/utils/visitStats'

const PAGE_SIZE = 12

export default function Passport({ visits }: { visits: Visit[] }) {
  const [shown, setShown] = useState(PAGE_SIZE)

  if (visits.length === 0) return <p className="text-gray-500">No visits yet.</p>

  return (
    <>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {visits.slice(0, shown).map((visit, i) => (
          <PassportTile key={visit.id} visit={visit} delay={(i % PAGE_SIZE) * 40} />
        ))}
      </ul>
      {shown < visits.length && (
        <button
          type="button"
          onClick={() => setShown((n) => n + PAGE_SIZE)}
          className="mt-4 w-full rounded-lg py-2 px-4 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Show more ({visits.length - shown} left)
        </button>
      )}
    </>
  )
}

function PassportTile({ visit, delay }: { visit: Visit; delay: number }) {
  const feature = formatDBShopAsFeature(visit.shop)

  return (
    <li className="animate-rise motion-reduce:animate-none" style={{ animationDelay: `${delay}ms` }}>
      <Link
        href={`/shops/${buildShopSlug(feature.properties)}`}
        className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-yellow-200 shadow-sm transition-transform duration-150 ease-out active:scale-[0.97]"
      >
        {visit.shop.photo && (
          <img src={visit.shop.photo} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3 text-white">
          {feature.properties.permanentlyClosed && (
            <span className="mb-1 inline-block rounded-full bg-red-600/90 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">
              Closed
            </span>
          )}
          <p className="font-semibold leading-tight line-clamp-2">{visit.shop.name}</p>
          <p className="text-xs text-white/75">{visit.shop.neighborhood}</p>
        </div>
      </Link>
    </li>
  )
}
