import Image from 'next/image'
import top from '@/public/advent/top.webp'

const untilLabel = (days: number) => (days === 1 ? 'Tomorrow' : `${days} days to go`)

export default function BeforeOpening({ days }: { days: number }) {
  return (
    <div data-reveal className="animate-rise overflow-hidden rounded-2xl border-4 border-gray-950 bg-white shadow-[6px_6px_0_#030712] motion-reduce:animate-none">
      <div className="relative border-b-4 border-gray-950">
        <Image src={top} alt="" sizes="(min-width: 1024px) 760px, 100vw" className="h-16 w-full object-cover object-left" />
        <span className="absolute bottom-0 left-5 translate-y-1/2 -rotate-2 rounded-lg border-4 border-gray-950 bg-yellow-300 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-950 shadow-[3px_3px_0_#030712]">
          {untilLabel(days)}
        </span>
      </div>
      <div className="p-5 pt-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900">Every jar is sealed</p>
        <h3 className="mt-1 font-serif text-3xl leading-tight tracking-tight text-gray-950 text-balance md:text-4xl">The first jar opens December 1st.</h3>
      </div>
    </div>
  )
}
