'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { useAuth } from '@/app/components/AuthProvider'
import { storageGet, storageSet } from '@/app/utils/storage'
import { useAnalytics } from '@/hooks'
import SaveCupDialog from './SaveCupDialog'
import Field from './tasting-journal/Field'
import LoggedStamp from './tasting-journal/LoggedStamp'
import OwnNote from './tasting-journal/OwnNote'
import Rating from './tasting-journal/Rating'

const BREW_METHODS = ['Pour-over / V60', 'AeroPress', 'French Press', 'Espresso', 'Drip']

// ponytail: the journal lives in localStorage, so it follows the browser rather
// than the account. Swap for a `user_tasting_notes` table + /api route once the
// real lineup ships and people expect their cups on every device.
const storageKey = (day: number) => `advent:journal:${day}`

type Entry = { rating: number; tasted: string[]; method: string; body: string; logged: boolean; pending: boolean }

const EMPTY: Entry = { rating: 0, tasted: [], method: '', body: '', logged: false, pending: false }

const readEntry = (day: number) => {
  try {
    return { ...EMPTY, ...JSON.parse(storageGet(storageKey(day)) ?? '{}') } as Entry
  } catch {
    return EMPTY
  }
}

const press = 'transition-[transform,box-shadow,background-color] duration-150 ease-out active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'

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

const cupProps = (day: number, entry: Entry, via: string) => ({
  jar: day,
  via,
  rating: entry.rating,
  method: entry.method || 'none',
  tasted: entry.tasted.length,
  wroteNotes: entry.body.trim() !== '',
})

const saveClass = `inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg border-2 border-gray-950 px-5 text-xs font-bold uppercase tracking-widest text-gray-950 shadow-[3px_3px_0_#030712] ${press}`

export default function TastingJournal({ day, step, notes, returnTo }: { day: number; step: number; notes: string[]; returnTo: string }) {
  const { user } = useAuth()
  const [entry, setEntry] = useState(EMPTY)
  const [justSaved, setJustSaved] = useState(false)
  const [justTicked, setJustTicked] = useState<string | null>(null)
  const [asking, setAsking] = useState(false)
  const track = useAnalytics()

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
    write({ logged: true, pending: false })
  }

  const saveFromButton = () => {
    if (!entry.logged) track('AdventCupSaved', { props: cupProps(day, entry, 'button') })
    save()
  }

  const askToSave = () => {
    track('AdventSavePrompted', { props: { jar: day } })
    write({ pending: true })
    setAsking(true)
  }

  const savePending = () => {
    track('AdventSaveAuthCompleted', { props: { jar: day } })
    track('AdventCupSaved', { props: cupProps(day, entry, 'auth') })
    save()
  }

  useEffect(() => {
    if (user && entry.pending) savePending()
  })

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
          <button type="button" onClick={saveFromButton} className={`${saveClass} ${entry.logged ? 'bg-white' : 'bg-yellow-300'}`}>
            {entry.logged && <Check className={`size-4 ${justSaved ? 'animate-stamp motion-reduce:animate-none' : ''}`} strokeWidth={3} />}
            {entry.logged ? 'Saved' : 'Save tasting note'}
          </button>
        ) : (
          <button type="button" onClick={askToSave} className={`${saveClass} bg-yellow-300`}>
            Save tasting note
          </button>
        )}
        <SaveCupDialog
          open={asking}
          onClose={() => setAsking(false)}
          onSaved={() => setAsking(false)}
          day={day}
          returnTo={returnTo}
        />
      </div>
    </div>
  )
}
