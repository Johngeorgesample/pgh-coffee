import { ArrowRight } from 'lucide-react'
import TrackedLink from '@/app/components/advent/TrackedLink'
import Banner from '@/app/components/advent/today-card/Banner'
import Specs, { specs } from '@/app/components/advent/today-card/Specs'
import { AdventDay } from '@/data/advent'

export default function TodayCard({ entry, step, href }: { entry: AdventDay; step: number; href: string }) {
  return (
    <div className="pb-4">
      <div className="group/lift">
        <div className="group relative rounded-2xl border-4 border-gray-950 bg-white shadow-[6px_6px_0_#030712] transition-[transform,box-shadow] duration-150 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover/lift:-translate-y-1 [@media(hover:hover)_and_(pointer:fine)]:group-hover/lift:shadow-[8px_8px_0_#030712] has-[a:active]:translate-y-0.5 has-[a:active]:shadow-[3px_3px_0_#030712] motion-reduce:transform-none">
          <Banner day={step} jar={entry.day} />
          <div className="grid gap-6 p-5 pt-7 md:grid-cols-[1.3fr_1fr] md:gap-0">
            <div className="flex flex-col justify-center pt-10 md:pr-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900">{entry.roasterName}</p>
              <h3 className="mt-1 font-serif text-3xl leading-tight tracking-tight text-gray-950 text-balance md:text-4xl">
                <TrackedLink
                  href={href}
                  event="AdventTodayCardClicked"
                  eventProps={{ step, jar: entry.day }}
                  className="after:absolute after:inset-0 after:z-10 after:rounded-xl"
                >
                  {entry.coffee}
                </TrackedLink>
              </h3>
            </div>
            {specs(entry).length > 0 && <Specs entry={entry} />}
            <span
              aria-hidden
              className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-gray-950 md:col-span-2 [@media(hover:hover)_and_(pointer:fine)]:hidden"
            >
              Story &amp; brew guide
              <span className="flex size-10 items-center justify-center rounded-full border-2 border-gray-950 bg-yellow-300 shadow-[2px_2px_0_#030712]">
                <ArrowRight className="size-5" strokeWidth={2.5} />
              </span>
            </span>
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
