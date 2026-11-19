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

const Label = ({ day, jar }: { day: number; jar: number }) => (
  <div className="relative border-b-4 border-gray-950">
    <Image src={top} alt="" sizes="(min-width: 1024px) 760px, 100vw" className="h-16 w-full object-cover object-left" />
    <span className="absolute bottom-0 left-5 flex translate-y-1/2 items-center gap-3">
      <span className="block size-24 animate-stamp overflow-hidden rounded-full border-4 border-gray-950 shadow-[4px_4px_0_#030712] motion-reduce:animate-none">
        <Image src={`/advent/labels/${jar}.webp`} alt={`Jar ${jar}`} width={240} height={240} sizes="96px" className="size-full" />
      </span>
      <span className="mt-12 -rotate-2 rounded-lg border-4 border-gray-950 bg-yellow-300 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-950 shadow-[3px_3px_0_#030712]">
        Today · Day {String(day).padStart(2, '0')}
      </span>
    </span>
  </div>
)

export default function TodayCard({ entry, step, href }: { entry: AdventDay; step: number; href: string }) {
  return (
    <div className="pb-4">
      <div className="group/lift">
        <div className="group relative overflow-hidden rounded-2xl border-4 border-gray-950 bg-white shadow-[6px_6px_0_#030712] transition-[transform,box-shadow] duration-150 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover/lift:-translate-y-1 [@media(hover:hover)_and_(pointer:fine)]:group-hover/lift:shadow-[8px_8px_0_#030712] has-[a:active]:translate-y-0.5 has-[a:active]:shadow-[3px_3px_0_#030712] motion-reduce:transform-none">
          <Label day={step} jar={entry.day} />
          <div className="grid gap-6 p-5 pt-7 md:grid-cols-[1.3fr_1fr] md:gap-0">
            <div className="flex flex-col justify-center pt-10 md:pr-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900">{entry.roasterName}</p>
              <h3 className="mt-1 font-serif text-3xl leading-tight tracking-tight text-gray-950 text-balance md:text-4xl">
                <Link href={href} className="after:absolute after:inset-0 after:z-10">
                  {entry.coffee}
                </Link>
              </h3>
            </div>
            <Specs entry={entry} />
          </div>
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-4 left-4 z-20 flex size-10 -translate-x-2 items-center justify-center rounded-full border-2 border-gray-950 bg-yellow-300 text-gray-950 opacity-0 shadow-[2px_2px_0_#030712] transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-has-[a:focus-visible]:translate-x-0 group-has-[a:focus-visible]:opacity-100 motion-reduce:translate-x-0 motion-reduce:transition-opacity"
          >
            <ArrowRight className="size-5" strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </div>
  )
}
