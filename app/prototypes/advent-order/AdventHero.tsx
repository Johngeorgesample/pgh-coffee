import Link from 'next/link'
import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { DYNAMIC_ROASTER_PATH, DYNAMIC_SHOP_URL } from '@/app/utils/advent-links'

const linkClass = 'underline decoration-white/40 underline-offset-4 transition-colors hover:text-yellow-300 hover:decoration-yellow-300'

export default function AdventHero() {
  return (
    <header className="relative bg-gradient-to-br from-stone-700 to-stone-900">
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <h1 className="mb-5 font-serif text-5xl leading-[1.05] tracking-tight text-white text-pretty md:text-6xl lg:text-7xl">
            Twenty-five days of Pittsburgh coffee.
          </h1>
          <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
            Curated by{' '}
            <Link href={DYNAMIC_ROASTER_PATH} className={linkClass}>
              Dynamic Coffee Roasters
            </Link>{' '}
            and{' '}
            <Link href="https://www.origincoffee.club/" target="_blank" className={linkClass}>
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
      </div>
    </header>
  )
}
