'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, Star } from 'lucide-react'
import { useAuth } from '@/app/components/AuthProvider'

const BREW_METHODS = ['Pour-over / V60', 'AeroPress', 'French Press', 'Espresso', 'Drip']

// ponytail: the journal lives in localStorage, so it follows the browser rather
// than the account. Swap for a `user_tasting_notes` table + /api route once the
// real lineup ships and people expect their cups on every device.
const storageKey = (day: number) => `advent:journal:${day}`

type Entry = { rating: number; tasted: string[]; method: string; body: string; logged: boolean }

const EMPTY: Entry = { rating: 0, tasted: [], method: '', body: '', logged: false }

const readEntry = (day: number) => {
  try {
    return { ...EMPTY, ...JSON.parse(localStorage.getItem(storageKey(day)) ?? '{}') } as Entry
  } catch {
    return EMPTY
  }
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">{children}</h3>
)

const Chip = ({ on, ...props }: { on: boolean } & React.ComponentProps<'button'>) => (
  <button
    type="button"
    aria-pressed={on}
    className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors ${
      on ? 'border-yellow-300 bg-yellow-100 text-yellow-800' : 'border-gray-200 bg-white text-slate-700 hover:bg-gray-100'
    }`}
    {...props}
  />
)

const Rating = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => (
  <div className="flex items-center gap-3">
    <div className="flex">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} out of 5`}
          aria-pressed={n === value}
          className="p-1"
        >
          <Star
            className={`size-6 ${n <= value ? 'fill-yellow-300 text-yellow-300' : 'fill-gray-200 text-gray-200'}`}
          />
        </button>
      ))}
    </div>
    <p className="text-lg font-bold text-slate-900">
      {value || '—'} <span className="text-sm font-medium text-stone-400">/ 5</span>
    </p>
  </div>
)

export default function TastingJournal({ day, notes }: { day: number; notes: string[] }) {
  const { user } = useAuth()
  const [entry, setEntry] = useState(EMPTY)
  const [draft, setDraft] = useState<string | null>(null)

  // The draft is kept for signed-out visitors too, so the sign-up round trip
  // the CTA sends them on doesn't throw away the cup they just scored.
  useEffect(() => setEntry(readEntry(day)), [day])

  const write = (patch: Partial<Entry>) => {
    const next = { ...entry, ...patch }
    setEntry(next)
    localStorage.setItem(storageKey(day), JSON.stringify(next))
  }

  const set = (patch: Partial<Entry>) => write({ ...patch, logged: false })

  const toggleTasted = (note: string) =>
    set({ tasted: entry.tasted.includes(note) ? entry.tasted.filter(n => n !== note) : [...entry.tasted, note] })

  const addOwnNote = () => {
    const note = draft?.trim()
    if (note && !entry.tasted.includes(note)) set({ tasted: [...entry.tasted, note] })
    setDraft(null)
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      {entry.logged && (
        <div className="mb-5 flex justify-end">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-yellow-800">
            <Check className="size-3.5" /> Logged today
          </span>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-stone-50 p-5">
        <div>
          <p className="font-semibold text-slate-900">Your rating</p>
          <p className="text-sm text-stone-500">Tap to score this cup</p>
        </div>
        <Rating value={entry.rating} onChange={rating => set({ rating })} />
      </div>

      <Label>Did you taste these notes?</Label>
      <div className="mb-6 flex flex-wrap gap-2">
        {[...notes, ...entry.tasted.filter(n => !notes.includes(n))].map(note => (
          <Chip key={note} on={entry.tasted.includes(note)} onClick={() => toggleTasted(note)}>
            {entry.tasted.includes(note) ? <Check className="size-4" /> : <span className="size-4 rounded-full border border-gray-300" />}
            {note}
          </Chip>
        ))}
        {draft === null ? (
          <button
            type="button"
            onClick={() => setDraft('')}
            className="min-h-11 rounded-full border border-dashed border-gray-300 px-4 text-sm font-medium text-stone-500 transition-colors hover:bg-gray-50"
          >
            + Add your own note
          </button>
        ) : (
          <input
            ref={el => el?.focus()}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={addOwnNote}
            onKeyDown={e => e.key === 'Enter' && addOwnNote()}
            aria-label="Add your own tasting note"
            placeholder="Dried cherry…"
            className="min-h-11 rounded-full border border-gray-300 px-4 text-sm text-slate-900 focus:border-yellow-300 focus:outline-none"
          />
        )}
      </div>

      <Label>Brew method used</Label>
      <div className="mb-6 flex flex-wrap gap-2">
        {BREW_METHODS.map(method => (
          <button
            key={method}
            type="button"
            aria-pressed={entry.method === method}
            onClick={() => set({ method: entry.method === method ? '' : method })}
            className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors ${
              entry.method === method
                ? 'border-gray-950 bg-gray-950 text-white'
                : 'border-gray-200 bg-white text-slate-700 hover:bg-gray-100'
            }`}
          >
            {method}
          </button>
        ))}
      </div>

      <Label>Personal notes</Label>
      <textarea
        rows={3}
        value={entry.body}
        onChange={e => set({ body: e.target.value })}
        aria-label="Personal notes"
        placeholder="e.g., ground at 14 clicks on Comandante, bright juicy apple finish with pleasant acidity…"
        className="mb-6 w-full rounded-xl border border-gray-200 bg-stone-50 p-4 text-slate-900 placeholder:text-stone-400 focus:border-yellow-300 focus:outline-none"
      />

      <div>
        {user ? (
          <button
            type="button"
            onClick={() => write({ logged: true })}
            className="min-h-11 rounded-full bg-gray-950 px-6 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
          >
            {entry.logged ? 'Saved' : 'Save tasting note'}
          </button>
        ) : (
          <Link
            href={`/sign-in?mode=signup&next=/advent/${day}`}
            className="inline-flex min-h-11 items-center rounded-full bg-gray-950 px-6 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
          >
            Save tasting note
          </Link>
        )}
      </div>
    </div>
  )
}
