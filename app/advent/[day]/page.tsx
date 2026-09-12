import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { ChevronLeft, ChevronRight, Flame, LockIcon, MapPin, QrCode } from 'lucide-react'
import { Footer } from '@/app/components/about'
import BrewGuide from '@/app/components/advent/BrewGuide'
import BrewVideo from '@/app/components/advent/BrewVideo'
import { AdventDay, ADVENT_DAYS, findAdventDay, otherDaysFor } from '@/data/advent'
import { formatDoorDate, parseDayParam, resolveOpenCount } from '@/app/utils/advent'
import { DYNAMIC_SHOP_URL } from '@/app/utils/advent-links'
import { getRoasterBySlug } from '@/app/utils/roasters'

// The door a reader may open depends on today's date in Pittsburgh.
export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ day: string }>
  searchParams: Promise<{ preview?: string }>
}

const resolveDay = async (params: Props['params']) => {
  const day = parseDayParam((await params).day)
  const entry = day ? findAdventDay(day) : undefined
  if (!entry) notFound()
  return entry
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const entry = await resolveDay(params)
  const { preview } = await searchParams
  const sealed = entry.day > resolveOpenCount(preview)

  // A sealed page still answers 200 so a scanned QR never looks broken, but it
  // has nothing worth indexing and would give the surprise away in search.
  if (sealed) {
    return {
      title: `Day ${entry.day} | Coffee Advent Calendar | pgh.coffee`,
      description: `Day ${entry.day} of the Pittsburgh coffee advent calendar opens ${formatDoorDate(entry.day)}.`,
      robots: { index: false },
    }
  }

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
      <Link href="/advent" className="flex shrink-0 items-center gap-1 text-sm font-semibold text-yellow-700 hover:underline">
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

const SealedDay = ({ entry }: { entry: AdventDay }) => (
  <div>
    <ScanStrip day={entry.day} />
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <LockIcon className="mx-auto mb-6 size-8 text-stone-300" aria-hidden />
      <p className="font-serif text-6xl leading-none text-stone-300">{String(entry.day).padStart(2, '0')}</p>
      <h1 className="mt-6 font-serif text-3xl tracking-tight text-slate-900 md:text-4xl">
        This door opens {formatDoorDate(entry.day)}.
      </h1>
      <p className="mx-auto mt-4 max-w-md leading-relaxed text-slate-600">
        Come back then and you&rsquo;ll find the roaster, the farm the coffee came from, and a brew guide from the people
        who roasted it.
      </p>
      <Link
        href="/advent"
        className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-semibold text-yellow-300 transition-colors hover:bg-neutral-800"
      >
        See which doors are open
        <ChevronRight className="size-4" />
      </Link>
    </div>
    <Footer />
  </div>
)

export default async function AdventDayPage({ params, searchParams }: Props) {
  const entry = await resolveDay(params)
  const { preview } = await searchParams

  if (entry.day > resolveOpenCount(preview)) return <SealedDay entry={entry} />

  const roaster = await getRoasterBySlug(entry.roasterSlug)
  const siblings = otherDaysFor(entry)
  const previous = entry.day > 1 ? entry.day - 1 : null
  const next = entry.day < ADVENT_DAYS ? entry.day + 1 : null

  return (
    <div>
      <ScanStrip day={entry.day} />

      <header className="relative h-80 bg-gradient-to-br from-stone-700 to-stone-900 sm:h-96">
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-6 pb-10">
            <span className="mb-4 inline-flex items-center rounded-full bg-yellow-300 px-2.5 py-1 text-xs font-semibold text-gray-950">
              Day {String(entry.day).padStart(2, '0')} &middot; {formatDoorDate(entry.day)}
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
        <section className="mx-auto max-w-7xl px-6 pt-10">
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
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div>
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
            {entry.blurb && <p className="leading-relaxed text-slate-600 text-pretty">{entry.blurb}</p>}
          </div>
          {entry.brew && <BrewGuide methods={entry.brew} />}
        </div>
      </section>

      {roaster && (
        <section className="mx-auto max-w-7xl px-6 pt-12">
          <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-wider text-stone-500">About the roaster</h2>
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
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

      {siblings.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pt-12">
          <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-wider text-stone-500">
            More from {entry.roasterName}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {siblings.map(sibling => (
              <li key={sibling.day}>
                <Link
                  href={`/advent/${sibling.day}`}
                  className="flex overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex w-14 shrink-0 flex-col items-center justify-center bg-yellow-300">
                    <span className="text-[10px] font-bold leading-none text-stone-600">DEC</span>
                    <span className="font-serif text-2xl leading-tight text-stone-900">{sibling.day}</span>
                  </div>
                  <div className="flex-1 p-4">
                    <p className="font-bold leading-tight text-slate-900">{sibling.coffee}</p>
                    <p className="mt-1 text-sm text-slate-500">{sibling.notes.join(', ')}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 pt-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {previous ? (
            <Link
              href={`/advent/${previous}`}
              className="flex items-center gap-3.5 rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <ChevronLeft className="size-5 shrink-0 text-stone-900" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-stone-500">Previous</p>
                <p className="font-semibold text-slate-900">Day {previous}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {next && (
            <Link
              href={`/advent/${next}`}
              className="flex items-center justify-end gap-3.5 rounded-xl border border-stone-200 bg-white p-5 text-right shadow-sm transition-shadow hover:shadow-md"
            >
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-stone-500">Next</p>
                <p className="font-semibold text-slate-900">Day {next}</p>
              </div>
              <ChevronRight className="size-5 shrink-0 text-stone-900" />
            </Link>
          )}
        </div>
      </section>

      <section className="px-6 pt-14">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-2xl bg-gray-950 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="mb-2 font-serif text-2xl tracking-tight text-white md:text-3xl">
              Want the other {ADVENT_DAYS - 1}?
            </h2>
            <p className="text-white/70">Calendars are sold by Dynamic Coffee Roasters.</p>
          </div>
          <a
            href={DYNAMIC_SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-2xl bg-yellow-300 px-5 py-3 font-semibold text-gray-950 transition-colors hover:bg-yellow-400 lg:self-auto"
          >
            Get a calendar
            <ArrowUpRightIcon className="size-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
