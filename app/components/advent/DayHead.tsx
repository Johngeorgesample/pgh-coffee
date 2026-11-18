import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { ADVENT_DAYS } from '@/data/advent'

const pad = (n: number) => String(n).padStart(2, '0')

const Arrow = ({ day, dir }: { day: number; dir: 'prev' | 'next' }) => {
  const Icon = dir === 'prev' ? ChevronLeft : ChevronRight
  const base = 'flex size-10 items-center justify-center rounded-full border'
  if (day < 1 || day > ADVENT_DAYS)
    return (
      <span aria-hidden className={`${base} border-stone-200 text-stone-300`}>
        <Icon className="size-5" />
      </span>
    )
  return (
    <Link
      href={`/advent/${day}`}
      aria-label={`Day ${day}`}
      className={`${base} border-stone-300 bg-white text-slate-900 transition-colors hover:bg-stone-100 active:scale-[0.96]`}
    >
      <Icon className="size-5" />
    </Link>
  )
}

export default function DayHead({ day }: { day: number }) {
  return (
    <div>
      <Link href="/advent" className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-slate-900">
        <ArrowLeft className="size-4" /> Advent calendar
      </Link>
      <div className="mt-6 flex items-end justify-between">
        <p className="flex items-baseline gap-2 font-serif leading-[0.85] text-slate-900">
          <span className="text-3xl tracking-tight text-stone-500">Day</span>
          <span className="text-[7rem] tracking-tighter">{pad(day)}</span>
        </p>
        <nav aria-label="Other days" className="flex gap-2 pb-2">
          <Arrow day={day - 1} dir="prev" />
          <Arrow day={day + 1} dir="next" />
        </nav>
      </div>
    </div>
  )
}
