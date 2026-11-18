import Image from 'next/image'
import Link from 'next/link'
import left from '@/public/advent/left.webp'
import { ANNOUNCED_ROASTERS } from '@/data/advent'

const ROW = 'flex items-baseline justify-between gap-3 py-1.5 font-serif text-xl leading-snug tracking-tight'

export default function WhosInTheBox() {
  return (
    <div className="-rotate-1 overflow-hidden rounded-2xl border-4 border-gray-950 bg-yellow-300 shadow-[6px_6px_0_#030712]">
      <div className="relative border-b-4 border-gray-950">
        <Image src={left} alt="" sizes="360px" className="h-36 w-full bg-white object-cover object-left" />
        <h2 className="absolute bottom-0 left-5 translate-y-1/2 rotate-2 rounded-lg border-4 border-gray-950 bg-white px-3 py-1.5 text-xs font-bold tracking-[0.2em] text-gray-950 uppercase shadow-[3px_3px_0_#030712]">
          Who&rsquo;s in the box
        </h2>
      </div>
      <div className="p-6">
        <ul className="mt-4">
          {ANNOUNCED_ROASTERS.map(({ slug, name }) => (
            <li key={name} className="border-b-2 border-gray-950/15 last:border-b-0">
              {slug ? (
                <Link href={`/roasters/${slug}`} className={`${ROW} text-gray-950 decoration-2 underline-offset-4 hover:underline`}>
                  {name}
                </Link>
              ) : (
                <span className={`${ROW} text-gray-950`}>{name}</span>
              )}
            </li>
          ))}
          <li>
            <span className={`${ROW} italic text-gray-700`}>and more…</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
