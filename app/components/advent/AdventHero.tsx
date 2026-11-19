import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import lid from '@/public/advent/center.webp'
import top from '@/public/advent/top.webp'
import right from '@/public/advent/right.webp'
import bottom from '@/public/advent/bottom.webp'
import left from '@/public/advent/left.webp'
import { DYNAMIC_SHOP_URL, DYNAMIC_WEBSITE_URL } from '@/app/utils/advent-links'

const ROWS = [
  { sides: [top, right, bottom, left], className: '-translate-x-[8%]' },
  { sides: [right, bottom, left, top], className: '-translate-x-[31%]' },
]

const LINK = 'underline decoration-gray-950/30 underline-offset-4 transition-colors hover:decoration-gray-950'
const CARD = 'border-4 border-gray-950 shadow-[10px_10px_0_#030712]'

const Wallpaper = () => (
  <div aria-hidden className="absolute inset-0 -z-10 flex flex-col">
    {ROWS.map(({ sides, className }, row) => (
      <div key={className} className={`flex-1 ${className}`}>
        <div
          className={`flex h-full w-max animate-marquee [animation-duration:150s] motion-reduce:animate-none ${row % 2 ? '[animation-direction:reverse]' : ''}`}
        >
          {[...sides, ...sides].map((side, i) => (
            <Image key={i} src={side} alt="" sizes="1400px" className="h-full w-auto shrink-0" />
          ))}
        </div>
      </div>
    ))}
    <div className="absolute inset-0 bg-white/75" />
  </div>
)

export default function AdventHero() {
  return (
    <header className="relative isolate overflow-hidden border-b-4 border-gray-950 bg-white">
      <Wallpaper />
      <div className="mx-auto grid max-w-6xl items-center px-6 py-16 md:grid-cols-[1.2fr_1fr] md:py-24">
        <div className={`relative z-10 -rotate-2 rounded-[2rem] bg-yellow-300 px-6 py-12 md:-mr-16 md:px-10 md:py-14 ${CARD}`}>
          <p className="mb-5 text-sm font-semibold tracking-[0.2em] text-gray-900 uppercase">
            Pittsburgh Coffee Advent Calendar · 2026
          </p>
          <h1 className="mb-6 font-serif text-5xl leading-[1.05] tracking-tight text-gray-950 text-balance md:text-6xl">
            <span className="whitespace-nowrap">Twenty-five</span> days of Pittsburgh coffee.
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-gray-900 md:text-xl">
            One jar a day, December 1st through Christmas. Grind it, brew it, and get to know the people roasting coffee in
            Pittsburgh. Curated by{' '}
            <Link href={DYNAMIC_WEBSITE_URL} target="_blank" className={LINK}>Dynamic Coffee Roasters</Link> and{' '}
            <Link href="https://www.origincoffee.club/" target="_blank" className={LINK}>Origin Coffee Club</Link>.
          </p>
          <a
            href={DYNAMIC_SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-semibold text-white transition-[transform,background-color] duration-150 ease-out hover:bg-gray-800 active:scale-[0.97]"
          >
            Get a calendar
            <ArrowUpRightIcon className="size-4" />
          </a>
        </div>
        <div className={`mt-8 rotate-3 overflow-hidden rounded-2xl md:mt-0 ${CARD}`}>
          <Image
            src={lid}
            alt="Pittsburgh Coffee Advent Calendar 2026 box lid, illustrated with city landmarks"
            priority
            placeholder="blur"
            sizes="(min-width: 768px) 440px, 100vw"
            className="aspect-square size-full object-cover"
          />
        </div>
      </div>
    </header>
  )
}
