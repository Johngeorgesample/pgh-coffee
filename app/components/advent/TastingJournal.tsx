'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, Star } from 'lucide-react'
import { useAuth } from '@/app/components/AuthProvider'
import { storageGet, storageSet } from '@/app/utils/storage'

const BREW_METHODS = ['Pour-over / V60', 'AeroPress', 'French Press', 'Espresso', 'Drip']

// ponytail: the journal lives in localStorage, so it follows the browser rather
// than the account. Swap for a `user_tasting_notes` table + /api route once the
// real lineup ships and people expect their cups on every device.
const storageKey = (day: number) => `advent:journal:${day}`

type Entry = { rating: number; tasted: string[]; method: string; body: string; logged: boolean }

const EMPTY: Entry = { rating: 0, tasted: [], method: '', body: '', logged: false }

const readEntry = (day: number) => {
  try {
    return { ...EMPTY, ...JSON.parse(storageGet(storageKey(day)) ?? '{}') } as Entry
  } catch {
    return EMPTY
  }
}

const press = 'transition-[transform,box-shadow,background-color] duration-150 ease-out active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'

const Label = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-900">{children}</h3>
)

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-3 border-t-2 border-gray-950 pt-5">
    <Label>{label}</Label>
    {children}
  </div>
)

const Chip = ({ on, ...props }: { on: boolean } & React.ComponentProps<'button'>) => (
  <button
    type="button"
    aria-pressed={on}
    className={`inline-flex min-h-11 items-center gap-1.5 rounded-lg border-2 border-gray-950 px-3.5 text-sm font-bold text-gray-950 ${press} ${
      on ? 'bg-yellow-300 shadow-[2px_2px_0_#030712]' : 'bg-white [@media(hover:hover)_and_(pointer:fine)]:hover:bg-yellow-100'
    }`}
    {...props}
  />
)

const Rating = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => {
  const [tap, setTap] = useState({ star: 0, count: 0 })
  const rate = (n: number) => {
    setTap(prev => ({ star: n, count: prev.count + 1 }))
    onChange(n)
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <Label>Your rating</Label>
        <p className="mt-1 font-serif text-3xl tracking-tight text-gray-950">
          {value || '—'}
          <span className="text-lg text-gray-500"> / 5</span>
        </p>
      </div>
      <div className="flex">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => rate(n)}
            aria-label={`${n} out of 5`}
            aria-pressed={n === value}
            className="p-1 transition-transform duration-150 ease-out active:scale-90"
          >
            <Star
              key={n === tap.star ? tap.count : 0}
              strokeWidth={2.5}
              className={`size-7 text-gray-950 ${n <= value ? 'fill-yellow-300' : 'fill-white'} ${
                n === tap.star ? 'animate-pop motion-reduce:animate-none' : ''
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

const OwnNote = ({ onAdd }: { onAdd: (note: string) => void }) => {
  const [draft, setDraft] = useState<string | null>(null)
  const commit = () => {
    onAdd(draft?.trim() ?? '')
    setDraft(null)
  }
  if (draft === null)
    return (
      <button
        type="button"
        onClick={() => setDraft('')}
        className="min-h-11 rounded-lg border-2 border-dashed border-gray-950/40 px-3.5 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-950"
      >
        + Add your own note
      </button>
    )
  return (
    <input
      ref={el => el?.focus()}
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={e => e.key === 'Enter' && commit()}
      aria-label="Add your own tasting note"
      placeholder="Dried cherry…"
      className="min-h-11 rounded-lg border-2 border-gray-950 px-3.5 text-sm text-gray-950 outline-none focus:border-gray-950 focus:bg-yellow-50 focus:ring-0"
    />
  )
}

const LoggedStamp = ({ step, justSaved }: { step: number; justSaved: boolean }) => (
  <span className="absolute top-0 right-5 -translate-y-1/2">
    <span
      className={`block -rotate-6 rounded-lg border-4 border-gray-950 bg-yellow-300 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-950 shadow-[3px_3px_0_#030712] ${
        justSaved ? 'animate-stamp motion-reduce:animate-none' : ''
      }`}
    >
      Logged · Day {String(step).padStart(2, '0')}
    </span>
  </span>
)

const saveClass = `inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg border-2 border-gray-950 px-5 text-xs font-bold uppercase tracking-widest text-gray-950 shadow-[3px_3px_0_#030712] ${press}`

export default function TastingJournal({ day, step, notes, returnTo }: { day: number; step: number; notes: string[]; returnTo: string }) {
  const { user } = useAuth()
  const [entry, setEntry] = useState(EMPTY)
  const [justSaved, setJustSaved] = useState(false)
  const [justTicked, setJustTicked] = useState<string | null>(null)

  // The draft is kept for signed-out visitors too, so the sign-up round trip
  // the CTA sends them on doesn't throw away the cup they just scored.
  useEffect(() => setEntry(readEntry(day)), [day])

  const write = (patch: Partial<Entry>) => {
    const next = { ...entry, ...patch }
    setEntry(next)
    storageSet(storageKey(day), JSON.stringify(next))
  }

  const set = (patch: Partial<Entry>) => {
    setJustSaved(false)
    write({ ...patch, logged: false })
  }

  const save = () => {
    setJustSaved(true)
    write({ logged: true })
  }

  const toggleTasted = (note: string) => {
    setJustTicked(note)
    set({ tasted: entry.tasted.includes(note) ? entry.tasted.filter(n => n !== note) : [...entry.tasted, note] })
  }

  const addOwnNote = (note: string) => {
    if (!note || entry.tasted.includes(note)) return
    setJustTicked(note)
    set({ tasted: [...entry.tasted, note] })
  }

  return (
    <div className="relative rounded-2xl border-4 border-gray-950 bg-white shadow-[6px_6px_0_#030712]">
      {entry.logged && <LoggedStamp step={step} justSaved={justSaved} />}
      <div className="flex flex-col gap-7 p-5 sm:p-7">
        <Rating value={entry.rating} onChange={rating => set({ rating })} />

        <Field label="Did you taste these?">
          <div className="flex flex-wrap gap-2">
            {[...notes, ...entry.tasted.filter(n => !notes.includes(n))].map(note => (
              <Chip key={note} on={entry.tasted.includes(note)} onClick={() => toggleTasted(note)}>
                {entry.tasted.includes(note) && (
                  <Check className={`size-4 ${note === justTicked ? 'animate-pop motion-reduce:animate-none' : ''}`} strokeWidth={3} />
                )}
                {note}
              </Chip>
            ))}
            <OwnNote onAdd={addOwnNote} />
          </div>
        </Field>

        <Field label="Brewed with">
          <div className="flex flex-wrap gap-2">
            {BREW_METHODS.map(method => (
              <Chip key={method} on={entry.method === method} onClick={() => set({ method: entry.method === method ? '' : method })}>
                {method}
              </Chip>
            ))}
          </div>
        </Field>

        <Field label="Personal notes">
          <textarea
            rows={3}
            value={entry.body}
            onChange={e => set({ body: e.target.value })}
            aria-label="Personal notes"
            placeholder="e.g., ground at 14 clicks on Comandante, bright juicy apple finish with pleasant acidity…"
            className="w-full rounded-lg border-2 border-gray-950 p-3 text-gray-950 placeholder:text-gray-400 outline-none focus:border-gray-950 focus:bg-yellow-50 focus:ring-0"
          />
        </Field>
      </div>

      <div className="border-t-4 border-gray-950 p-4">
        {user ? (
          <button type="button" onClick={save} className={`${saveClass} ${entry.logged ? 'bg-white' : 'bg-yellow-300'}`}>
            {entry.logged && <Check className={`size-4 ${justSaved ? 'animate-stamp motion-reduce:animate-none' : ''}`} strokeWidth={3} />}
            {entry.logged ? 'Saved' : 'Save tasting note'}
          </button>
        ) : (
          <Link href={`/sign-in?mode=signup&next=${encodeURIComponent(returnTo)}`} className={`${saveClass} bg-yellow-300`}>
            Save tasting note
          </Link>
        )}
      </div>
    </div>
  )
}
