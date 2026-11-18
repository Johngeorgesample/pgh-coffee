import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import top from '@/public/advent/top.webp'
import { AdventDay } from '@/data/advent'

const specs = (entry: AdventDay) =>
  [
    entry.notes.length > 0 && { label: 'Tasting notes', value: entry.notes.join(' · ') },
    entry.origin && { label: 'Origin', value: entry.origin },
    entry.varietal && { label: 'Varietal', value: entry.varietal },
    entry.process && { label: 'Process', value: entry.process },
  ].filter(Boolean) as { label: string; value: string }[]

const Specs = ({ entry }: { entry: AdventDay }) => (
  <dl className="flex flex-col border-y-2 border-gray-950 md:-my-5 md:-mt-7 md:-mr-5 md:border-y-0 md:border-l-2">
    {specs(entry).map(({ label, value }) => (
      <div key={label} className="flex flex-1 flex-col justify-center border-gray-950/20 py-3 not-last:border-b-2 md:px-5">
        <dt className="text-[10px] font-bold uppercase tracking-widest text-gray-900">{label}</dt>
        <dd className="mt-0.5 text-sm text-gray-950">{value}</dd>
      </div>
    ))}
  </dl>
)

const Label = ({ day }: { day: number }) => (
  <div className="relative border-b-4 border-gray-950">
    <Image src={top} alt="" sizes="(min-width: 1024px) 760px, 100vw" className="h-16 w-full object-cover object-left" />
    <span className="absolute bottom-0 left-5 translate-y-1/2 -rotate-2 rounded-lg border-4 border-gray-950 bg-yellow-300 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-950 shadow-[3px_3px_0_#030712]">
      Today · Dec {day}
    </span>
  </div>
)

export default function TodayCard({ entry }: { entry: AdventDay }) {
  return (
    <div className="pb-4">
      <div className="overflow-hidden rounded-2xl border-4 border-gray-950 bg-white shadow-[6px_6px_0_#030712]">
        <Label day={entry.day} />
        <div className="grid gap-6 p-5 pt-7 md:grid-cols-[1.3fr_1fr] md:gap-0">
          <div className="flex flex-col justify-center md:pr-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900">{entry.roasterName}</p>
            <Link href={`/advent/${entry.day}`} className="mt-1 block decoration-2 underline-offset-4 hover:underline">
              <h3 className="font-serif text-3xl leading-tight tracking-tight text-gray-950 text-balance md:text-4xl">{entry.coffee}</h3>
            </Link>
            <div>
              <Link
                href={`/advent/${entry.day}`}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800 active:scale-[0.97]"
              >
                Read today&rsquo;s coffee <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          <Specs entry={entry} />
        </div>
      </div>
    </div>
  )
}
