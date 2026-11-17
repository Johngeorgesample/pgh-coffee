'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'
import { RevealButton, opensOn, useRevealed } from './Spoiler'
import { ORDERS, Order, jarsInOrder, pad } from './orders'
import type { AdventDay } from '@/data/advent'

export const useRoute = () => {
  const [order, setOrder] = useState(ORDERS[0])
  const { isHidden, reveal } = useRevealed()
  const stops = jarsInOrder(order).map(stop => ({ ...stop, hidden: isHidden(stop.step, stop.entry.day) }))
  return { order, setOrder, stops, reveal, showJar: order.id !== 'curated' }
}

export const OrderHeading = ({ order, onChange }: { order: Order; onChange: (o: Order) => void }) => (
  <div>
    <h2 className="font-serif text-3xl tracking-tight text-slate-900">{order.label} order</h2>
    <fieldset className="mt-4 inline-flex rounded-full bg-stone-100 p-1 text-sm">
      <legend className="sr-only">Order</legend>
      {ORDERS.map(o => {
        const active = o.id === order.id
        return (
          <button
            key={o.id}
            aria-pressed={active}
            onClick={() => onChange(o)}
            className={`rounded-full px-3.5 py-1.5 font-medium transition-colors active:scale-[0.97] ${
              active ? 'bg-white text-slate-900 shadow-sm' : 'text-stone-500 hover:text-slate-900'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </fieldset>
    <p key={order.id} className="proto-rise mt-3 max-w-xl text-sm leading-relaxed text-stone-500">{order.blurb}</p>
  </div>
)

export const StepDot = ({ step, className = '' }: { step: number; className?: string }) => (
  <span className={`flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-950 text-xs font-bold text-white ring-4 ring-white ${className}`}>
    {step}
  </span>
)

export const JarTag = ({ jar }: { jar: number }) => (
  <span className="shrink-0 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1 font-mono text-xs text-slate-600">Jar {pad(jar)}</span>
)

export const Locked = ({ step, onReveal }: { step: number; onReveal: () => void }) => (
  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
    <p className="flex items-center gap-1.5 text-sm font-medium text-stone-400">
      <Lock className="size-3.5" />
      {opensOn(step)}
    </p>
    <RevealButton step={step} onReveal={onReveal} />
  </div>
)

export const NoteChips = ({ entry }: { entry: AdventDay }) =>
  entry.notes.length ? (
    <ul className="flex flex-wrap gap-1.5">
      {entry.notes.map(note => (
        <li key={note} className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">{note}</li>
      ))}
    </ul>
  ) : null

export const rise = (step: number) => ({ animationDelay: `${Math.min(step, 12) * 18}ms` })
