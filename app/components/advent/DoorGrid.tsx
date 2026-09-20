import Link from 'next/link'
import { LockIcon } from 'lucide-react'
import { ADVENT_LINEUP } from '@/data/advent'
import { adventHref, formatDoorDate } from '@/app/utils/advent'

const pad = (day: number) => String(day).padStart(2, '0')

const ShutDoor = ({ day, isToday }: { day: number; isToday: boolean }) => (
  <div
    title={`Opens ${formatDoorDate(day)}`}
    className={`flex h-32 flex-col items-center justify-center gap-1 rounded-xl bg-stone-100 sm:h-48 ${
      isToday ? 'border-2 border-gray-950' : 'border border-stone-200'
    }`}
  >
    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-300">Dec</span>
    <span className="font-serif text-4xl leading-none text-stone-300 sm:text-5xl">{pad(day)}</span>
    <LockIcon className="size-3 text-stone-300" aria-hidden />
    <span className="sr-only">Day {day} opens {formatDoorDate(day)}</span>
  </div>
)

const OpenDoor = ({ day, preview }: { day: number; preview?: string }) => {
  const entry = ADVENT_LINEUP[day - 1]
  return (
    <Link
      href={adventHref(`/advent/${day}`, preview)}
      className="group flex h-32 flex-col rounded-xl border border-stone-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:h-48 sm:p-4"
    >
      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Day {pad(day)}</span>
      <p className="mt-1 line-clamp-3 text-xs font-bold leading-tight text-slate-900 sm:mt-2 sm:line-clamp-none sm:text-sm">
        {entry.roasterName}
      </p>
      <p className="hidden font-serif text-sm leading-snug text-stone-600 sm:mt-1 sm:block">{entry.coffee}</p>
      <p className="hidden text-xs text-stone-500 sm:mt-1 sm:block">{entry.notes.join(', ')}</p>
      <span className="mt-auto text-xs font-semibold text-yellow-700 group-hover:underline">Read it &rarr;</span>
    </Link>
  )
}

export default function DoorGrid({
  openCount,
  today,
  preview,
}: {
  openCount: number
  today: number
  preview?: string
}) {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
      {ADVENT_LINEUP.map(({ day }) =>
        day <= openCount ? (
          <OpenDoor key={day} day={day} preview={preview} />
        ) : (
          <ShutDoor key={day} day={day} isToday={day === today} />
        )
      )}
    </div>
  )
}
