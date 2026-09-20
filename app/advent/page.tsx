import type { Metadata } from 'next'
import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { Footer } from '@/app/components/about'
import DoorGrid from '@/app/components/advent/DoorGrid'
import { ADVENT_LINEUP } from '@/data/advent'
import { currentDoor, resolveOpenCount } from '@/app/utils/advent'
import { DYNAMIC_SHOP_URL } from '@/app/utils/advent-links'

// Doors open at midnight in Pittsburgh, so the page can't be baked at build time.
export const dynamic = 'force-dynamic'

const description = `Twenty-four days of Pittsburgh coffee: a different local roaster behind every door, curated by Dynamic Coffee Roasters. Open each day to read where the coffee came from and how to brew it.`

export const metadata: Metadata = {
  title: 'Coffee Advent Calendar | pgh.coffee',
  description,
  openGraph: {
    title: 'Coffee Advent Calendar | pgh.coffee',
    description,
    images: ['/opengraph-image'],
  },
}

const roasterNames = Array.from(new Set(ADVENT_LINEUP.map(entry => entry.roasterName))).sort((a, b) =>
  a.localeCompare(b)
)

export default async function AdventCalendar({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>
}) {
  const { preview } = await searchParams
  const openCount = resolveOpenCount(preview)

  return (
    <div>
      <header className="relative bg-gradient-to-br from-stone-700 to-stone-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <h1 className="mb-5 font-serif text-5xl leading-[1.05] tracking-tight text-white text-pretty md:text-6xl lg:text-7xl">
              Twenty-four days of Pittsburgh coffee.
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
              A different local roaster behind every door, curated by Dynamic Coffee Roasters. Open a day to read
              where the coffee came from, who grew it, and how to brew it.
            </p>
            <a
              href={DYNAMIC_SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-yellow-300 px-5 py-3 font-semibold text-gray-950 transition-colors hover:bg-yellow-400"
            >
              Get a calendar
              <ArrowUpRightIcon className="size-4" />
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pt-16">
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Who&rsquo;s in the box</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {roasterNames.map(name => (
              <li
                key={name}
                className="inline-flex rounded-full border border-gray-200 bg-neutral-50 px-3.5 py-1.5 text-sm text-slate-700"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">The calendar</h2>
        <p className="mb-7 mt-2.5 font-serif text-3xl tracking-tight text-slate-900 md:text-4xl">Open today&rsquo;s door.</p>
        <DoorGrid openCount={openCount} today={preview ? 0 : currentDoor()} preview={preview} />
      </section>

      <Footer />
    </div>
  )
}
