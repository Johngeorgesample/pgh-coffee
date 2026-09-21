import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { ChevronRight, Flame, MapPin, QrCode } from 'lucide-react'
import { Footer } from '@/app/components/about'
import BrewVideo from '@/app/components/advent/BrewVideo'
import TastingJournal from '@/app/components/advent/TastingJournal'
import { ADVENT_DAYS, findAdventDay } from '@/data/advent'
import { parseDayParam } from '@/app/utils/advent'
import { getRoasterBySlug } from '@/app/utils/roasters'

type Props = { params: Promise<{ day: string }> }

const resolveDay = async (params: Props['params']) => {
  const day = parseDayParam((await params).day)
  const entry = day ? findAdventDay(day) : undefined
  if (!entry) notFound()
  return entry
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = await resolveDay(params)
  const title = `${entry.coffee} — ${entry.roasterName} | Day ${entry.day}`
  const description = `Day ${entry.day} of the Pittsburgh coffee advent calendar: ${entry.coffee} from ${entry.roasterName}. ${entry.notes.join(', ')}.`
  return {
    title: `${title} | pgh.coffee`,
    description,
    openGraph: { title, description, images: ['/opengraph-image'] },
  }
}

const ScanStrip = ({ day }: { day: number }) => (
  <div className="border-b border-yellow-300 bg-yellow-100">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-3">
      <p className="flex items-center gap-2.5 text-sm text-yellow-900">
        <QrCode className="size-4 shrink-0" aria-hidden />
        <span>
          You scanned <strong className="font-bold">Day {String(day).padStart(2, '0')}</strong> of the Pittsburgh Coffee
          Advent Calendar.
        </span>
      </p>
      <Link
        href="/advent"
        className="flex shrink-0 items-center gap-1 text-sm font-semibold text-yellow-700 hover:underline"
      >
        All {ADVENT_DAYS} days
        <ChevronRight className="size-4" />
      </Link>
    </div>
  </div>
)

const Spec = ({ label, value }: { label: string; value?: string }) =>
  value ? (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-stone-500">{label}</p>
      <p className="font-semibold leading-snug text-slate-900">{value}</p>
    </div>
  ) : null

export default async function AdventDayPage({ params }: Props) {
  const entry = await resolveDay(params)

  const roaster = await getRoasterBySlug(entry.roasterSlug)

  return (
    <div>
      <ScanStrip day={entry.day} />

      <header className="relative h-64 bg-gradient-to-br from-stone-700 to-stone-900 sm:h-80">
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-6 pb-10 lg:pb-28">
            <span className="mb-4 inline-flex items-center rounded-full bg-yellow-300 px-2.5 py-1 text-xs font-semibold text-gray-950">
              Day {String(entry.day).padStart(2, '0')}
            </span>
            <h1 className="font-serif text-4xl leading-tight tracking-tight text-white text-pretty md:text-5xl">
              {entry.coffee}
            </h1>
            <p className="mt-2.5 text-white/80">
              Roasted by <span className="font-semibold text-white">{entry.roasterName}</span>
              {entry.origin && ` · ${entry.origin}`}
            </p>
          </div>
        </div>
      </header>

      {(entry.producer || entry.origin || entry.varietal || entry.process || entry.altitude) && (
        <section className="relative z-10 mx-auto max-w-7xl px-6 pt-10 lg:pt-0 lg:-translate-y-1/2">
          <div className="grid gap-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm sm:grid-cols-2 sm:p-8 lg:grid-cols-5">
            <Spec label="Producer" value={entry.producer} />
            <Spec label="Origin" value={entry.origin} />
            <Spec label="Varietal" value={entry.varietal} />
            <Spec label="Process" value={entry.process} />
            <Spec label="Altitude" value={entry.altitude} />
          </div>
        </section>
      )}

      <BrewVideo videoId={entry.videoId} roasterName={entry.roasterName} />

      <section className="mx-auto max-w-7xl px-6 pt-12">
        <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-wider text-stone-500">In the cup</h2>
        <ul className="mb-5 flex flex-wrap gap-2">
          {entry.notes.map(note => (
            <li
              key={note}
              className="inline-flex rounded-full bg-yellow-100 px-3.5 py-1.5 text-sm font-medium text-yellow-700"
            >
              {note}
            </li>
          ))}
        </ul>
        {entry.blurb && <p className="max-w-4xl leading-relaxed text-slate-600 text-pretty">{entry.blurb}</p>}
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-12">
        <TastingJournal day={entry.day} notes={entry.notes} />
      </section>

      {roaster && (
        <section className="mx-auto max-w-7xl px-6 pt-12">
          <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-wider text-stone-500">About the roaster</h2>
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-3.5 flex flex-col items-start gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-300 px-2.5 py-1 text-xs font-semibold text-gray-950">
                <Flame className="size-3.5" />
                Coffee roaster
              </span>
              <h3 className="font-serif text-2xl tracking-tight text-slate-900">{entry.roasterName}</h3>
            </div>
            {roaster.description && (
              <p className="mb-5 max-w-4xl text-sm leading-relaxed text-gray-600">{roaster.description}</p>
            )}
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/roasters/${entry.roasterSlug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm transition-colors hover:bg-gray-100"
              >
                <MapPin className="size-4" />
                Where to find this coffee
              </Link>
              {roaster.website && (
                <a
                  href={roaster.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm transition-colors hover:bg-gray-100"
                >
                  <ArrowUpRightIcon className="size-4" />
                  Website
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
