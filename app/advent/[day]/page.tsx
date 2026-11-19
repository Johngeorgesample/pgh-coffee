import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { ReactNode } from 'react'
import { Footer } from '@/app/components/about'
import BrewVideo from '@/app/components/advent/BrewVideo'
import DayHead from '@/app/components/advent/DayHead'
import RoastMeter from '@/app/components/advent/RoastMeter'
import MarkVisited from '@/app/components/advent/MarkVisited'
import TastingJournal from '@/app/components/advent/TastingJournal'
import { AdventDay, findAdventDay } from '@/data/advent'
import { Order, findOrder, jarHref, stepOf } from '@/data/advent-orders'
import { parseDayParam, splitMarked } from '@/app/utils/advent'
import { getRoasterBySlug } from '@/app/utils/roasters'
import top from '@/public/advent/top.webp'

type Props = { params: Promise<{ day: string }>; searchParams: Promise<{ order?: string }> }
type TRoaster = Awaited<ReturnType<typeof getRoasterBySlug>>

const resolveDay = async (params: Props['params']) => {
  const day = parseDayParam((await params).day)
  const entry = day ? findAdventDay(day) : undefined
  if (!entry) notFound()
  return entry
}

const resolveOrder = async (searchParams: Props['searchParams']) => findOrder((await searchParams).order)

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const entry = await resolveDay(params)
  const step = stepOf(await resolveOrder(searchParams), entry.day)
  const title = `${entry.coffee} — ${entry.roasterName} | Day ${step}`
  const description = `Day ${step} of the Pittsburgh coffee advent calendar: ${entry.coffee} from ${entry.roasterName}.${entry.notes.length ? ` ${entry.notes.join(', ')}.` : ''}`
  return {
    title: `${title} | pgh.coffee`,
    description,
    openGraph: { title, description, images: ['/opengraph-image'] },
  }
}

const specs = (entry: AdventDay) =>
  [
    ['Tasting notes', entry.notes.join(' · ')],
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

const prose = 'max-w-2xl text-lg leading-relaxed text-gray-800 text-pretty'

const Highlight = ({ text, order }: { text: string; order: number }) => (
  <mark className="relative isolate bg-transparent font-semibold whitespace-nowrap text-gray-950">
    <span
      aria-hidden
      className="absolute -inset-x-0.5 top-1 bottom-0.5 -z-10 origin-left -rotate-1 animate-sweep rounded-sm bg-yellow-300 motion-reduce:animate-none"
      style={{ animationDelay: `${200 + order * 60}ms` }}
    />
    {text}
  </mark>
)

const Blurb = ({ text }: { text: string }) => {
  const parts = splitMarked(text)
  const order = (i: number) => parts.slice(0, i).filter(p => p.marked).length
  return (
    <p className={prose}>
      {parts.map((part, i) => (part.marked ? <Highlight key={i} text={part.text} order={order(i)} /> : part.text))}
    </p>
  )
}

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section>
    <h2 className="mb-4 font-serif text-4xl tracking-tight text-gray-950">{title}</h2>
    {children}
  </section>
)

const inkButton =
  'relative inline-flex min-h-11 items-center gap-2 rounded-lg border-2 border-gray-950 bg-white px-4 text-sm font-bold text-gray-950 shadow-[3px_3px_0_#030712] transition-[transform,box-shadow,background-color] duration-150 ease-out [@media(hover:hover)_and_(pointer:fine)]:hover:bg-yellow-300 [@media(hover:hover)_and_(pointer:fine)]:hover:not-active:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:hover:not-active:shadow-[3px_5px_0_#030712] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none after:absolute after:inset-x-0 after:top-full after:h-1'

const AboutRoaster = ({ entry, roaster }: { entry: AdventDay; roaster: NonNullable<TRoaster> }) => (
  <Section title="About the roaster">
    {roaster.description && <p className={`mb-5 ${prose}`}>{roaster.description}</p>}
    <div className="flex flex-wrap gap-3">
      <Link href={`/roasters/${entry.roasterSlug}`} className={inkButton}>
        <MapPin className="size-4" strokeWidth={2.5} />
        Where to find this coffee
      </Link>
      {roaster.website && (
        <a href={roaster.website} target="_blank" rel="noopener noreferrer" className={inkButton}>
          <ArrowUpRight className="size-4" strokeWidth={2.5} />
          Website
        </a>
      )}
    </div>
  </Section>
)

const Sheet = ({ entry, order, step }: { entry: AdventDay; order: Order; step: number }) => (
  <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
    <DayHead order={order} />
    <div className="overflow-hidden rounded-2xl border-4 border-gray-950 bg-white shadow-[6px_6px_0_#030712]">
      <div className="relative border-b-4 border-gray-950">
        <Image src={top} alt="" sizes="340px" className="h-24 w-full object-cover object-left" />
        <span className="absolute bottom-0 left-5 flex translate-y-1/2 items-center gap-3">
          <span className="block size-24 animate-stamp overflow-hidden rounded-full border-4 border-gray-950 shadow-[4px_4px_0_#030712] motion-reduce:animate-none">
            <Image src={`/advent/labels/${entry.day}.webp`} alt={`Jar ${entry.day}`} width={240} height={240} sizes="96px" className="size-full" />
          </span>
          <span className="mt-12 -rotate-2 rounded-lg border-4 border-gray-950 bg-yellow-300 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-950 shadow-[3px_3px_0_#030712]">
            Day {String(step).padStart(2, '0')}
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-6 p-5 pt-16">
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

const Reading = ({ entry, order, step, roaster }: { entry: AdventDay; order: Order; step: number; roaster: TRoaster }) => (
  <div className="flex flex-col gap-14 lg:pt-6">
    <MarkVisited jar={entry.day} />
    {entry.blurb && (
      <Section title="In the cup">
        <Blurb text={entry.blurb} />
      </Section>
    )}
    <Section title="Watch the roaster brew it">
      <BrewVideo videoId={entry.videoId} roasterName={entry.roasterName} />
    </Section>
    <Section title="My tasting journal">
      <TastingJournal day={entry.day} step={step} notes={entry.notes} returnTo={jarHref(order, entry.day)} />
    </Section>
    {roaster && <AboutRoaster entry={entry} roaster={roaster} />}
  </div>
)

export default async function AdventDayPage({ params, searchParams }: Props) {
  const entry = await resolveDay(params)
  const order = await resolveOrder(searchParams)
  const step = stepOf(order, entry.day)
  const roaster = entry.roasterSlug ? await getRoasterBySlug(entry.roasterSlug) : null

  return (
    <div className="bg-stone-50">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-20">
        <Sheet entry={entry} order={order} step={step} />
        <Reading entry={entry} order={order} step={step} roaster={roaster} />
      </div>
      <Footer />
    </div>
  )
}
