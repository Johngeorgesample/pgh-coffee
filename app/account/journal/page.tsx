'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { ADVENT_LINEUP } from '@/data/advent'
import { readEntry } from '@/app/components/advent/TastingJournal'

const loadCups = () => ADVENT_LINEUP.map(day => ({ day, entry: readEntry(day.day) })).filter(c => c.entry.logged)

type Cup = ReturnType<typeof loadCups>[number]

const Stars = ({ n }: { n: number }) => (
  <span className="inline-flex" aria-label={`${n} out of 5`}>
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} strokeWidth={0} className={`size-4 ${i <= n ? 'fill-yellow-400' : 'fill-gray-200'}`} />
    ))}
  </span>
)

const Row = ({ day, entry }: Cup) => (
  <tr className="align-top hover:bg-yellow-50">
    <td className="px-4 py-3 font-mono text-gray-500">{String(day.day).padStart(2, '0')}</td>
    <td className="px-4 py-3">
      <Link href={`/advent/${day.day}`} className="font-medium text-gray-900 hover:text-yellow-600">{day.coffee}</Link>
      <div className="text-gray-500">{day.roasterName}</div>
    </td>
    <td className="px-4 py-3"><Stars n={entry.rating} /></td>
    <td className="hidden px-4 py-3 text-gray-700 md:table-cell">{entry.tasted.join(', ') || '—'}</td>
    <td className="hidden px-4 py-3 text-gray-700 lg:table-cell">{entry.method || '—'}</td>
    <td className="hidden max-w-xs px-4 py-3 text-gray-700 lg:table-cell">{entry.body || '—'}</td>
  </tr>
)

const Logbook = ({ cups }: { cups: Cup[] }) => (
  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
    <table className="w-full text-left text-sm">
      <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
        <tr>
          <th className="px-4 py-3">Day</th>
          <th className="px-4 py-3">Coffee</th>
          <th className="px-4 py-3">Rating</th>
          <th className="hidden px-4 py-3 md:table-cell">Tasted</th>
          <th className="hidden px-4 py-3 lg:table-cell">Brewed</th>
          <th className="hidden px-4 py-3 lg:table-cell">Notes</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {cups.map(cup => <Row key={cup.day.day} {...cup} />)}
      </tbody>
    </table>
  </div>
)

const Empty = () => (
  <p className="text-gray-500">
    Nothing logged yet. Open a jar on the <Link href="/advent" className="font-medium text-yellow-700 hover:text-yellow-800">advent calendar</Link> and save a cup.
  </p>
)

export default function JournalPage() {
  const [cups, setCups] = useState<Cup[] | null>(null)
  useEffect(() => setCups(loadCups()), [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tasting journal</h1>
        {cups && cups.length > 0 && <p className="text-gray-500">{cups.length} cups logged from the advent calendar.</p>}
      </div>
      {cups && (cups.length ? <Logbook cups={cups} /> : <Empty />)}
    </div>
  )
}
