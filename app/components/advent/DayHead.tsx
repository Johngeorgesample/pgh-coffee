import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Order, calendarHref } from '@/data/advent-orders'

export default function DayHead({ order }: { order: Order }) {
  return (
    <Link href={calendarHref(order)} className="-my-3 inline-flex items-center gap-1.5 self-start py-3 text-sm font-semibold text-gray-700 transition-colors hover:text-gray-950">
      <ArrowLeft className="size-4" strokeWidth={2.5} /> Advent calendar
    </Link>
  )
}
