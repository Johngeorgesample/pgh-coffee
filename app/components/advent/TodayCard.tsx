import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import RoastMeter from '@/app/components/advent/RoastMeter'
import { AdventDay } from '@/data/advent'

const specs = (entry: AdventDay) =>
  [
    entry.origin && { label: 'Origin', value: entry.origin },
    entry.varietal && { label: 'Varietal', value: entry.varietal },
    entry.process && { label: 'Process', value: entry.process },
  ].filter(Boolean) as { label: string; value: string }[]

const Specs = ({ entry }: { entry: AdventDay }) => (
  <dl className="mt-6 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
    {specs(entry).map(({ label, value }) => (
      <div key={label}>
        <dt className="text-[11px] font-bold uppercase tracking-widest text-stone-500">{label}</dt>
        <dd className="mt-1 text-sm leading-snug text-slate-900">{value}</dd>
      </div>
    ))}
  </dl>
)

export default function TodayCard({ entry }: { entry: AdventDay }) {
  return (
    <div className="border-b border-stone-200 pb-8">
      <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Today</p>
      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-amber-800">{entry.roasterName}</p>
      <Link href={`/advent/${entry.day}`} className="group mt-1 block">
        <h3 className="font-serif text-4xl leading-tight tracking-tight text-slate-900 text-balance group-hover:underline md:text-5xl">
          {entry.coffee}
        </h3>
      </Link>
      {entry.notes.length > 0 && <p className="mt-3 text-lg text-stone-600">{entry.notes.join(', ')}</p>}
      <Specs entry={entry} />
      {entry.agtron && (
        <div className="mt-6 max-w-sm">
          <RoastMeter agtron={entry.agtron} roast={entry.roast} />
        </div>
      )}
      <Link
        href={`/advent/${entry.day}`}
        className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-slate-900 hover:underline"
      >
        Read today&rsquo;s coffee <ArrowRight className="size-4" />
      </Link>
    </div>
  )
}
