'use client'

import { useState } from 'react'
import { BrewMethod } from '@/data/advent'

export default function BrewGuide({ methods }: { methods: BrewMethod[] }) {
  const [active, setActive] = useState(0)
  const method = methods[active]

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
      <h3 className="px-6 pt-5 text-xs font-semibold uppercase tracking-wider text-stone-500">How to brew it</h3>

      <div className="flex gap-1.5 px-6 pt-4">
        {methods.map((m, i) => (
          <button
            key={m.label}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={`min-h-11 flex-1 rounded-full border px-3 text-sm font-semibold transition-colors ${
              i === active
                ? 'border-gray-950 bg-gray-950 text-yellow-300'
                : 'border-gray-200 bg-white text-slate-700 hover:bg-gray-100'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="px-6 pb-6 pt-5">
        {method.rows.map(row => (
          <div key={row.label} className="flex items-baseline justify-between border-b border-gray-100 py-3">
            <span className="text-sm text-stone-500">{row.label}</span>
            <span className="text-base font-semibold text-slate-900">{row.value}</span>
          </div>
        ))}
        {method.note && <p className="mt-4 text-sm leading-relaxed text-stone-500">{method.note}</p>}
      </div>
    </div>
  )
}
