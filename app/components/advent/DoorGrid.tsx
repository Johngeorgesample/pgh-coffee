import Link from 'next/link'
import { ADVENT_LINEUP, AdventDay } from '@/data/advent'

const pad = (day: number) => String(day).padStart(2, '0')

const Chip = ({ value }: { value?: string }) =>
  value ? (
    <span className="inline-flex rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-xs text-slate-600">
      {value}
    </span>
  ) : null

const Door = ({ entry }: { entry: AdventDay }) => (
  <Link
    href={`/advent/${entry.day}`}
    className="flex flex-col rounded-2xl border border-stone-200 bg-stone-50 p-5 transition-colors hover:border-stone-400"
  >
    <span className="mb-10 inline-flex self-start rounded-full bg-gray-950 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
      Day {pad(entry.day)}
    </span>
    <p className="text-xs font-bold uppercase leading-tight tracking-wider text-amber-800">{entry.roasterName}</p>
    <p className="mb-1 mt-1.5 font-serif text-2xl leading-tight tracking-tight text-slate-900">
      {entry.coffee}
    </p>
    <p className="text-sm leading-snug text-stone-500">
      {[entry.varietal, entry.origin].filter(Boolean).join(' · ')}
    </p>
    <div className="mt-4 flex flex-wrap gap-2">
      <Chip value={entry.process} />
      <Chip value={entry.roast} />
    </div>
  </Link>
)

export default function DoorGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ADVENT_LINEUP.map(entry => (
        <Door key={entry.day} entry={entry} />
      ))}
    </div>
  )
}
