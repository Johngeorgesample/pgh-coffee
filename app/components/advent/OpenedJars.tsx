'use client'

import Link from 'next/link'
import { LockedLid } from '@/app/components/advent/SealedJars'
import SectionHead from '@/app/components/advent/SectionHead'
import { AdventDay } from '@/data/advent'

const EASE = 'ease-[cubic-bezier(0.23,1,0.32,1)]'

const PRESS = `transition-transform duration-150 ${EASE} active:scale-[0.97] motion-reduce:transition-none`

const pad = (n: number) => String(n).padStart(2, '0')

type Stop = { step: number; entry: AdventDay; href: string; missed: boolean }

type TTagProps = { step: number; entry: AdventDay; href: string; tilt: string }

const Tag = ({ step, entry, href, tilt }: TTagProps) => (
  <Link
    href={href}
    className={`group relative block pl-8 pt-8 ${PRESS}`}
  >
    <LockedLid jar={entry.day} className="absolute left-0 top-0 z-10 w-16!">
      <span className="sr-only">Dec {step}</span>
    </LockedLid>
    <div
      className={`rounded-lg border-2 border-gray-950 bg-white p-3 pl-10 shadow-[3px_3px_0_#030712] transition-transform duration-200 ${EASE} ${tilt} group-hover:rotate-0 motion-reduce:transition-none`}
    >
      <p className="font-mono text-[10px] font-bold text-gray-500">Day {pad(step)}</p>
      <p className="mt-0.5 text-[10px] font-bold uppercase leading-tight tracking-[0.15em] text-gray-900">{entry.roasterName}</p>
      <p className="mt-0.5 font-serif text-base leading-tight text-gray-950">{entry.coffee}</p>
    </div>
  </Link>
)

const Waiting = ({ step, entry, href }: Omit<TTagProps, 'tilt'>) => (
  <Link href={href} className={`group relative block pl-8 pt-8 ${PRESS}`}>
    <LockedLid
      jar={entry.day}
      className="absolute left-0 top-0 z-10 w-16! transition-transform duration-200 ease-out group-hover:-rotate-12 motion-reduce:transition-none"
    />
    <div className="rounded-lg border-2 border-dashed border-gray-950 bg-yellow-50 p-3 pl-10">
      <p className="font-mono text-[10px] font-bold text-gray-500">Day {pad(step)}</p>
      <p className="mt-0.5 font-serif text-base leading-tight text-gray-950">Still sealed</p>
      <p className="mt-1 inline-block rounded border-2 border-gray-950 bg-yellow-300 px-1 text-[10px] font-bold uppercase tracking-widest text-gray-950">
        Catch up
      </p>
    </div>
  </Link>
)

const CatchUpNote = ({ count }: { count: number }) => (
  <p className="mt-3 text-sm text-gray-700">
    {count} from before you started {count === 1 ? 'is' : 'are'} still sealed. Open {count === 1 ? 'it' : 'them'} whenever.
  </p>
)

export default function OpenedJars({ stops }: { stops: Stop[] }) {
  const missed = stops.filter(stop => stop.missed).length
  return (
    <section className="mt-12">
      <SectionHead title="Opened" count={stops.length - missed} />
      {missed > 0 && <CatchUpNote count={missed} />}
      <ul className="mt-8 grid grid-cols-1 gap-x-5 gap-y-8 min-[440px]:grid-cols-2 sm:grid-cols-3">
        {stops.map(({ step, entry, href, missed }, i) => (
          <li key={entry.day} data-reveal style={{ animationDelay: `${(i % 3) * 40}ms` }} className="animate-rise motion-reduce:animate-none">
            {missed ? (
              <Waiting step={step} entry={entry} href={href} />
            ) : (
              <Tag step={step} entry={entry} href={href} tilt={i % 2 ? 'rotate-[1.5deg]' : '-rotate-[1.5deg]'} />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
