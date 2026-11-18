import Link from 'next/link'
import { ArrowRight, Droplets, Flame, MapPin, Sprout } from 'lucide-react'
import { AdventDay } from '@/data/advent'
import { beanShade } from '@/app/utils/advent'

type TTile = { icon: typeof MapPin; label: string; value: string; swatch?: string }

const roastLabel = (entry: AdventDay) =>
  [entry.roast, entry.agtron && `Agtron ${Math.round(entry.agtron)}`].filter(Boolean).join(' · ')

const tiles = (entry: AdventDay) =>
  [
    entry.origin && { icon: MapPin, label: 'Origin', value: entry.origin },
    roastLabel(entry) && {
      icon: Flame,
      label: 'Roast',
      value: roastLabel(entry),
      swatch: entry.agtron && beanShade(entry.agtron),
    },
    entry.varietal && { icon: Sprout, label: 'Varietal', value: entry.varietal },
    entry.process && { icon: Droplets, label: 'Process', value: entry.process },
  ].filter(Boolean) as TTile[]

const Tile = ({ icon: Icon, label, value, swatch }: TTile) => (
  <div className="rounded-xl bg-white/[0.06] p-4">
    <div className="flex items-center justify-between text-white/45">
      <Icon className="size-4" />
      {swatch && <span className="size-3.5 rounded-full ring-1 ring-white/20" style={{ background: swatch }} />}
    </div>
    <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-white/45">{label}</p>
    <p className="mt-0.5 text-sm leading-snug text-white">{value}</p>
  </div>
)

const NoteChips = ({ notes }: { notes: string[] }) => (
  <ul className="flex flex-wrap gap-1.5">
    {notes.map(note => (
      <li key={note} className="rounded-full bg-yellow-300/15 px-2.5 py-0.5 text-xs font-medium text-yellow-200">
        {note}
      </li>
    ))}
  </ul>
)

const Identity = ({ step, entry }: { step: number; entry: AdventDay }) => (
  <div className="flex flex-col">
    <p className="text-xs font-bold uppercase tracking-wider text-yellow-300">Today · Day {step}</p>
    <p className="mt-6 text-xs font-bold uppercase tracking-wider text-white/60">{entry.roasterName}</p>
    <p className="mt-1 font-serif text-3xl leading-tight tracking-tight text-balance md:text-4xl">{entry.coffee}</p>
    {entry.producer && <p className="mt-2 text-sm text-white/60">Grown by {entry.producer}</p>}
    {entry.notes.length > 0 && (
      <div className="mt-5">
        <NoteChips notes={entry.notes} />
      </div>
    )}
    <Link
      href={`/advent/${entry.day}`}
      className="mt-auto inline-flex items-center gap-1 self-start pt-6 text-xs font-medium text-yellow-300 hover:underline"
    >
      Learn more about the coffee <ArrowRight className="size-3.5" />
    </Link>
  </div>
)

export default function TodayCard({ step, entry }: { step: number; entry: AdventDay }) {
  const items = tiles(entry)
  return (
    <div className="grid gap-8 rounded-2xl bg-gray-950 p-6 text-white md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:p-8">
      <Identity step={step} entry={entry} />
      {items.length > 0 && (
        <div className="grid grid-cols-2 content-start gap-2">
          {items.map(item => (
            <Tile key={item.label} {...item} />
          ))}
        </div>
      )}
    </div>
  )
}
