import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function DayHead() {
  return (
    <Link href="/advent" className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-gray-700 transition-colors hover:text-gray-950">
      <ArrowLeft className="size-4" strokeWidth={2.5} /> Advent calendar
    </Link>
  )
}
