import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { ADVENT_DAYS } from '@/data/advent'

const Step = ({ day, dir }: { day: number; dir: 'prev' | 'next' }) => {
  const Icon = dir === 'prev' ? ChevronLeft : ChevronRight
  const base = 'flex size-10 items-center justify-center rounded-lg border-2'
  if (day < 1 || day > ADVENT_DAYS)
    return (
      <span aria-hidden className={`${base} border-gray-950/15 text-gray-300`}>
        <Icon className="size-5" strokeWidth={2.5} />
      </span>
    )
  return (
    <Link
      href={`/advent/${day}`}
      aria-label={`Day ${day}`}
      className={`${base} border-gray-950 bg-white text-gray-950 shadow-[2px_2px_0_#030712] transition-[transform,box-shadow,background-color] duration-150 ease-out hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none`}
    >
      <Icon className="size-5" strokeWidth={2.5} />
    </Link>
  )
}

export default function DayHead({ day }: { day: number }) {
  return (
    <div className="flex items-center justify-between">
      <Link href="/advent" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 transition-colors hover:text-gray-950">
        <ArrowLeft className="size-4" strokeWidth={2.5} /> Advent calendar
      </Link>
      <nav aria-label="Other days" className="flex gap-2">
        <Step day={day - 1} dir="prev" />
        <Step day={day + 1} dir="next" />
      </nav>
    </div>
  )
}
