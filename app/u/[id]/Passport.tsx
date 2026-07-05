'use client'

import { useState } from 'react'
import ShopCard from '@/app/components/ShopCard'
import { formatDBShopAsFeature } from '@/app/utils/utils'
import type { Visit } from '@/app/utils/visitStats'

const PAGE_SIZE = 10

export default function Passport({ visits }: { visits: Visit[] }) {
  const [shown, setShown] = useState(PAGE_SIZE)

  if (visits.length === 0) return <p className="text-gray-500">No visits yet.</p>

  return (
    <>
      <ul>
        {visits.slice(0, shown).map((visit) => (
          <ShopCard key={visit.id} shop={formatDBShopAsFeature(visit.shop)} />
        ))}
      </ul>
      {shown < visits.length && (
        <button
          type="button"
          onClick={() => setShown((n) => n + PAGE_SIZE)}
          className="w-full rounded-lg py-2 px-4 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Show more ({visits.length - shown} left)
        </button>
      )}
    </>
  )
}
