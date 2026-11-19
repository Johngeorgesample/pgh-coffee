'use client'

import Link from 'next/link'
import { LockedLid } from '@/app/components/advent/SealedJars'
import SectionHead from '@/app/components/advent/SectionHead'
import { AdventDay } from '@/data/advent'

const EASE = 'ease-[cubic-bezier(0.23,1,0.32,1)]'

const pad = (n: number) => String(n).padStart(2, '0')

type TTagProps = { step: number; entry: AdventDay; href: string; tilt: string }

const Tag = ({ step, entry, href, tilt }: TTagProps) => (
  <Link
    href={href}
    className={`group relative block pl-8 pt-8 transition-transform duration-150 ${EASE} active:scale-[0.97] motion-reduce:transition-none`}
  >
    <LockedLid jar={entry.day} className="absolute left-0 top-0 z-10 w-16!">
      <span className="sr-only">Dec {step}</span>
    </LockedLid>
    <div
      className={`rounded-lg border-2 border-gray-950 bg-white p-3 pl-10 shadow-[3px_3px_0_#030712] transition-transform duration-200 ${EASE} ${tilt} group-hover:rotate-0 motion-reduce:transition-none`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[10px] font-bold uppercase leading-tight tracking-[0.15em] text-gray-900">{entry.roasterName}</p>
        <p className="shrink-0 font-mono text-[10px] font-bold text-gray-500">Jar {pad(entry.day)}</p>
      </div>
      <p className="mt-0.5 font-serif text-base leading-tight text-gray-950">{entry.coffee}</p>
    </div>
  </Link>
)

type TOpenedJarsProps = { stops: { step: number; entry: AdventDay; href: string }[] }

export default function OpenedJars({ stops }: TOpenedJarsProps) {
  return (
    <section className="mt-12">
      <SectionHead title="Opened" count={stops.length} />
      <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3">
        {stops.map(({ step, entry, href }, i) => (
          <li key={entry.day} style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }} className="animate-rise motion-reduce:animate-none">
            <Tag step={step} entry={entry} href={href} tilt={i % 2 ? 'rotate-[1.5deg]' : '-rotate-[1.5deg]'} />
          </li>
        ))}
      </ul>
    </section>
  )
}
