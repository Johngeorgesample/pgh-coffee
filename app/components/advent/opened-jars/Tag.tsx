import Link from 'next/link'
import LockedLid from '@/app/components/advent/sealed-jars/LockedLid'
import { EASE, PRESS, pad } from '@/app/components/advent/ui'
import { AdventDay } from '@/data/advent'

export type TTagProps = { step: number; entry: AdventDay; href: string; tilt: string }

const Tag = ({ step, entry, href, tilt }: TTagProps) => (
  <Link href={href} className={`group relative block pl-8 pt-8 ${PRESS}`}>
    <LockedLid jar={entry.day} className="absolute left-0 top-0 z-10 w-16!">
      <span className="sr-only">Dec {step}</span>
    </LockedLid>
    <div
      className={`rounded-lg border-2 border-gray-950 bg-white p-3 pl-10 shadow-[3px_3px_0_#030712] transition-transform duration-200 ${EASE} ${tilt} group-hover:rotate-0 motion-reduce:transition-none`}
    >
      <p className="font-mono text-[10px] font-bold text-gray-500">Day {pad(step)}</p>
      <p className="mt-0.5 text-[10px] font-bold uppercase leading-tight tracking-[0.15em] text-gray-900">
        {entry.roasterName}
      </p>
      <p className="mt-0.5 font-serif text-base leading-tight text-gray-950">{entry.coffee}</p>
    </div>
  </Link>
)

export default Tag
