'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAnalytics } from '@/hooks'
import { adventTeaser, currentDate } from '@/app/utils/advent'
import top from '@/public/advent/top.webp'

export const AdventCTA = () => {
  const plausible = useAnalytics()
  const [teaser, setTeaser] = useState<string | null>(null)
  useEffect(() => setTeaser(adventTeaser(currentDate())), [])

  if (!teaser) return null

  return (
    <Link
      href="/advent"
      onClick={() => plausible('AdventCTAClick', { props: { teaser } })}
      className="my-5 mr-2 block -rotate-1 animate-rise overflow-hidden rounded-3xl border-4 border-gray-950 bg-yellow-300 shadow-[6px_6px_0_#030712] transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:rotate-0 active:translate-x-[3px] active:translate-y-[3px] active:shadow-[3px_3px_0_#030712] motion-reduce:transition-none motion-reduce:animate-none"
    >
      <Image src={top} alt="" sizes="480px" className="h-32 w-full border-b-4 border-gray-950 object-cover" />
      <div className="px-7 py-7">
        <p className="text-xs font-semibold tracking-[0.2em] text-gray-900 uppercase">Advent calendar · 2026</p>
        <p className="mt-3 font-serif text-3xl leading-tight tracking-tight text-gray-950 text-balance">
          <span className="whitespace-nowrap">Twenty-five</span> days of Pittsburgh coffee.
        </p>
        <span className="mt-6 inline-flex items-center rounded-2xl bg-gray-950 px-5 py-3 text-sm font-semibold text-yellow-300">
          {teaser} →
        </span>
      </div>
    </Link>
  )
}
