import Image from 'next/image'
import top from '@/public/advent/top.webp'
import { PRESS, pad } from '@/app/components/advent/ui'

const SealedToday = ({ step, onOpen }: { step: number; onOpen: () => void }) => (
  <div className="overflow-hidden rounded-2xl border-4 border-gray-950 bg-white shadow-[6px_6px_0_#030712]">
    <div className="relative border-b-4 border-gray-950">
      <Image
        src={top}
        alt=""
        sizes="(min-width: 1024px) 760px, 100vw"
        className="h-16 w-full object-cover object-left"
      />
      <span className="absolute bottom-0 left-5 translate-y-1/2 -rotate-2 rounded-lg border-4 border-gray-950 bg-yellow-300 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-950 shadow-[3px_3px_0_#030712]">
        Today · Day {pad(step)}
      </span>
    </div>
    <div className="flex flex-wrap items-end justify-between gap-4 p-5 pt-9">
      <h3 className="font-serif text-3xl leading-tight tracking-tight text-gray-950 text-balance">
        Your first jar is waiting.
      </h3>
      <button
        onClick={onOpen}
        className={`rounded-2xl bg-gray-950 px-5 py-3 font-semibold text-white hover:bg-gray-800 ${PRESS}`}
      >
        Open today&rsquo;s jar
      </button>
    </div>
  </div>
)

export default SealedToday
