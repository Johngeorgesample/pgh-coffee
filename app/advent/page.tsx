import type { Metadata } from 'next'
import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { Footer } from '@/app/components/about'
import AdventRoute from '@/app/components/advent/AdventRoute'
import BoxSides from '@/app/components/advent/BoxSides'
import Image from 'next/image'
import lid from '@/public/advent/center.png'
import Link from 'next/link'
import { DYNAMIC_ROASTER_PATH, DYNAMIC_SHOP_URL } from '@/app/utils/advent-links'

const description = `Twenty-five days of Pittsburgh coffee: a different local roaster behind every door, curated by Dynamic Coffee Roasters. Open each day to read where the coffee came from and how to brew it.`

export const metadata: Metadata = {
  title: 'Coffee Advent Calendar | pgh.coffee',
  description,
  openGraph: {
    title: 'Coffee Advent Calendar | pgh.coffee',
    description,
    images: ['/opengraph-image'],
  },
}

export default function AdventCalendar() {
  return (
    <div>
      <header className="bg-neutral-950">
        <div className=" mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <h1 className="mb-5 font-serif text-5xl leading-[1.05] tracking-tight text-white text-pretty md:text-6xl lg:text-7xl">
              Twenty-five days of Pittsburgh coffee.
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
              Twenty-five whole-bean coffees from Pittsburgh roasters, curated by{' '}
              <Link href={DYNAMIC_ROASTER_PATH} className="underline decoration-white/40 underline-offset-4 transition-colors hover:text-yellow-300 hover:decoration-yellow-300">
                Dynamic Coffee Roasters
              </Link>
              {" "}and{" "}
              <Link href="https://www.origincoffee.club/" target="_blank" className="underline decoration-white/40 underline-offset-4 transition-colors hover:text-yellow-300 hover:decoration-yellow-300">
              Origin Coffee Club
              </Link>
              .
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
          <Image
            src={lid}
            alt="Pittsburgh Coffee Advent Calendar 2026 box lid, illustrated with city landmarks"
            priority
            placeholder="blur"
            sizes="(min-width: 1024px) 560px, 100vw"
            className="mx-auto w-full max-w-xl rotate-2 rounded-2xl shadow-2xl ring-1 ring-white/10"
          />
        </div>
      </header>

      <BoxSides />

      <AdventRoute />

      <Footer />
    </div>
  )
}
