import Image from 'next/image'
import Link from 'next/link'
import lid from '@/public/advent/center.webp'
import { DYNAMIC_WEBSITE_URL } from '@/app/utils/advent-links'
import GetCalendar from './GetCalendar'
import { CARD, EYEBROW } from './styles'

const LINK = 'underline decoration-gray-950/30 underline-offset-4 transition-colors hover:decoration-gray-950'

export default function FullHero() {
  return (
    <div className="mx-auto grid max-w-6xl items-center px-6 py-16 returning:hidden md:grid-cols-[1.2fr_1fr] md:py-24">
      <div
        className={`relative z-10 -rotate-2 rounded-[2rem] bg-yellow-300 px-6 py-12 md:-mr-16 md:px-10 md:py-14 ${CARD}`}
      >
        <p className={`mb-5 ${EYEBROW}`}>Pittsburgh Coffee Advent Calendar · 2026</p>
        <h1 className="mb-6 font-serif text-5xl leading-[1.05] tracking-tight text-gray-950 text-balance md:text-6xl">
          <span className="whitespace-nowrap">Twenty-five</span> days of Pittsburgh coffee.
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-gray-900 md:text-xl">
          One jar a day, December 1st through Christmas. Grind it, brew it, and get to know the people roasting coffee
          in Pittsburgh. Curated by{' '}
          <Link href={DYNAMIC_WEBSITE_URL} target="_blank" className={LINK}>
            Dynamic Coffee Roasters
          </Link>{' '}
          and{' '}
          <Link href="https://www.origincoffee.club/" target="_blank" className={LINK}>
            Origin Coffee Club
          </Link>
          .
        </p>
        <GetCalendar />
      </div>
      <div className={`mt-8 rotate-3 overflow-hidden rounded-2xl md:mt-0 ${CARD}`}>
        <Image
          src={lid}
          alt="Pittsburgh Coffee Advent Calendar 2026 box lid, illustrated with city landmarks"
          fetchPriority="high"
          placeholder="blur"
          sizes="(min-width: 768px) 440px, 100vw"
          className="aspect-square size-full object-cover"
        />
      </div>
    </div>
  )
}
