import Link from 'next/link'
import LockedLid from '@/app/components/advent/sealed-jars/LockedLid'
import { PRESS, pad } from '@/app/components/advent/ui'
import { TTagProps } from './Tag'

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

export default Waiting
