import Image from 'next/image'
import DayHead from '@/app/components/advent/DayHead'
import RoastMeter from '@/app/components/advent/RoastMeter'
import SpecList, { specs } from '@/app/components/advent/day/SpecList'
import { AdventDay } from '@/data/advent'
import { Order } from '@/data/advent-orders'
import top from '@/public/advent/top.webp'

const Sheet = ({ entry, order, step }: { entry: AdventDay; order: Order; step: number }) => (
  <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
    <DayHead order={order} />
    <div className="rounded-2xl border-4 border-gray-950 bg-white shadow-[6px_6px_0_#030712]">
      <div className="relative border-b-4 border-gray-950">
        <Image src={top} alt="" sizes="340px" className="h-24 w-full rounded-t-xl object-cover object-left" />
        <span className="absolute bottom-0 left-5 flex translate-y-1/2 items-center gap-3">
          <span
            data-reveal
            className="block size-24 animate-stamp overflow-hidden rounded-full border-4 border-gray-950 shadow-[4px_4px_0_#030712] motion-reduce:animate-none"
          >
            <Image
              src={`/advent/labels/${entry.day}.webp`}
              alt={`Jar ${entry.day}`}
              width={240}
              height={240}
              sizes="96px"
              className="size-full"
            />
          </span>
          <span className="mt-12 -rotate-2 rounded-lg border-4 border-gray-950 bg-yellow-300 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-950 shadow-[3px_3px_0_#030712]">
            Day {String(step).padStart(2, '0')}
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-6 p-5 pt-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900">{entry.roasterName}</p>
          <h1 className="mt-1.5 font-serif text-4xl leading-tight tracking-tight text-gray-950 text-balance">
            {entry.coffee}
          </h1>
        </div>
        {entry.agtron && <RoastMeter agtron={entry.agtron} roast={entry.roast} />}
        {specs(entry).length > 0 && <SpecList entry={entry} />}
      </div>
    </div>
  </aside>
)

export default Sheet
