'use client'

import { useEffect, useState } from 'react'

type Props = { step: number; onReveal: () => void }

const muted = 'text-stone-500 transition-colors hover:text-slate-900'

const Prompt = ({ step, onArm }: { step: number; onArm: () => void }) => (
  <span className="group relative inline-flex">
    <button
      onClick={onArm}
      aria-describedby={`peek-tip-${step}`}
      className={`text-sm font-medium underline decoration-dotted underline-offset-4 ${muted}`}
    >
      Peek
    </button>
    <span
      id={`peek-tip-${step}`}
      role="tooltip"
      className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 w-56 rounded-lg bg-gray-950 px-3 py-2 text-xs leading-snug text-white opacity-0 shadow-lg transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-within:opacity-100"
    >
      See this day&rsquo;s roaster and coffee before it opens. Spoilers ahead!
    </span>
  </span>
)

const Confirm = ({ step, onReveal, onCancel }: Props & { onCancel: () => void }) => (
  <span className="inline-flex animate-rise flex-wrap items-center gap-2 text-sm motion-reduce:animate-none">
    <span className="text-slate-700">Spoil Day {step} early?</span>
    <button onClick={onReveal} className="rounded-full bg-gray-950 px-3 py-1 font-semibold text-white active:scale-[0.97]">
      Show me
    </button>
    <button onClick={onCancel} className={muted}>
      Keep it a surprise
    </button>
  </span>
)

export default function PeekButton({ step, onReveal }: Props) {
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (!armed) return
    const timeout = setTimeout(() => setArmed(false), 4000)
    return () => clearTimeout(timeout)
  }, [armed])

  return armed ? (
    <Confirm step={step} onReveal={onReveal} onCancel={() => setArmed(false)} />
  ) : (
    <Prompt step={step} onArm={() => setArmed(true)} />
  )
}
