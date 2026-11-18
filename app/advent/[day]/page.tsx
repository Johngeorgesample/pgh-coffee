import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { MapPin } from 'lucide-react'
import { ReactNode } from 'react'
import { Footer } from '@/app/components/about'
import BrewVideo from '@/app/components/advent/BrewVideo'
import DayHead from '@/app/components/advent/DayHead'
import RoastMeter from '@/app/components/advent/RoastMeter'
import TastingJournal from '@/app/components/advent/TastingJournal'
import { AdventDay, findAdventDay } from '@/data/advent'
import { parseDayParam } from '@/app/utils/advent'
import { getRoasterBySlug } from '@/app/utils/roasters'
import top from '@/public/advent/top.webp'

type Props = { params: Promise<{ day: string }> }
type TRoaster = Awaited<ReturnType<typeof getRoasterBySlug>>

const resolveDay = async (params: Props['params']) => {
  const day = parseDayParam((await params).day)
  const entry = day ? findAdventDay(day) : undefined
  if (!entry) notFound()
  return entry
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = await resolveDay(params)
  const title = `${entry.coffee} — ${entry.roasterName} | Day ${entry.day}`
  const description = `Day ${entry.day} of the Pittsburgh coffee advent calendar: ${entry.coffee} from ${entry.roasterName}.${entry.notes.length ? ` ${entry.notes.join(', ')}.` : ''}`
  return {
    title: `${title} | pgh.coffee`,
    description,
    openGraph: { title, description, images: ['/opengraph-image'] },
  }
}

const specs = (entry: AdventDay) =>
  [
    ['Origin', entry.origin],
    ['Varietal', entry.varietal],
    ['Process', entry.process],
    ['Producer', entry.producer],
    ['Roaster since', entry.founded && String(entry.founded)],
  ].filter((pair): pair is [string, string] => Boolean(pair[1]))

const SpecList = ({ entry }: { entry: AdventDay }) => (
  <dl className="border-y-2 border-gray-950 text-sm">
    {specs(entry).map(([label, value]) => (
      <div key={label} className="flex justify-between gap-6 border-gray-950/20 py-2.5 not-last:border-b-2">
        <dt className="text-[10px] font-bold uppercase tracking-widest text-gray-900">{label}</dt>
        <dd className="text-right font-semibold text-gray-950">{value}</dd>
      </div>
    ))}
  </dl>
)

const FlavorList = ({ notes }: { notes: string[] }) => (
  <ul className="flex flex-wrap gap-x-5 gap-y-1 font-serif text-3xl tracking-tight text-slate-900">
    {notes.map((note, i) => (
      <li key={note} className="animate-rise motion-reduce:animate-none" style={{ animationDelay: `${i * 40}ms` }}>
        {note}
        {i < notes.length - 1 && <span className="ml-5 text-yellow-400">·</span>}
      </li>
    ))}
  </ul>
)

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section>
    <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-wider text-stone-500">{title}</h2>
    {children}
  </section>
)

const pill = 'inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm transition-colors hover:bg-gray-100'

const AboutRoaster = ({ entry, roaster }: { entry: AdventDay; roaster: NonNullable<TRoaster> }) => (
  <Section title="About the roaster">
    {roaster.description && <p className="mb-5 max-w-2xl text-sm leading-relaxed text-gray-600">{roaster.description}</p>}
    <div className="flex flex-wrap gap-2">
      <Link href={`/roasters/${entry.roasterSlug}`} className={pill}>
        <MapPin className="size-4" />
        Where to find this coffee
      </Link>
      {roaster.website && (
        <a href={roaster.website} target="_blank" rel="noopener noreferrer" className={pill}>
          <ArrowUpRightIcon className="size-4" />
          Website
        </a>
      )}
    </div>
  </Section>
)

const Sheet = ({ entry }: { entry: AdventDay }) => (
  <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
    <DayHead day={entry.day} />
    <div className="overflow-hidden rounded-2xl border-4 border-gray-950 bg-white shadow-[6px_6px_0_#030712]">
      <div className="relative border-b-4 border-gray-950">
        <Image src={top} alt="" sizes="340px" className="h-24 w-full object-cover object-left" />
        <span className="absolute bottom-0 left-5 translate-y-1/2 -rotate-2 rounded-lg border-4 border-gray-950 bg-yellow-300 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-950 shadow-[3px_3px_0_#030712]">
          Day {String(entry.day).padStart(2, '0')} · Dec {entry.day}
        </span>
      </div>
      <div className="flex flex-col gap-6 p-5 pt-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900">{entry.roasterName}</p>
          <h1 className="mt-1.5 font-serif text-4xl leading-tight tracking-tight text-gray-950 text-balance">{entry.coffee}</h1>
        </div>
        {entry.agtron && <RoastMeter agtron={entry.agtron} roast={entry.roast} />}
        {specs(entry).length > 0 && <SpecList entry={entry} />}
      </div>
    </div>
  </aside>
)

const Reading = ({ entry, roaster }: { entry: AdventDay; roaster: TRoaster }) => (
  <main className="flex flex-col gap-14 lg:pt-6">
    {(entry.notes.length > 0 || entry.blurb) && (
      <Section title="In the cup">
        <FlavorList notes={entry.notes} />
        {entry.blurb && <p className="mt-6 max-w-2xl leading-relaxed text-slate-600 text-pretty">{entry.blurb}</p>}
      </Section>
    )}
    <Section title="Watch the roaster brew it">
      <BrewVideo videoId={entry.videoId} roasterName={entry.roasterName} />
    </Section>
    <Section title="My tasting journal">
      <TastingJournal day={entry.day} notes={entry.notes} />
    </Section>
    {roaster && <AboutRoaster entry={entry} roaster={roaster} />}
  </main>
)

export default async function AdventDayPage({ params }: Props) {
  const entry = await resolveDay(params)
  const roaster = entry.roasterSlug ? await getRoasterBySlug(entry.roasterSlug) : null

  return (
    <div className="bg-stone-50">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-20">
        <Sheet entry={entry} />
        <Reading entry={entry} roaster={roaster} />
      </div>
      <Footer />
    </div>
  )
}
