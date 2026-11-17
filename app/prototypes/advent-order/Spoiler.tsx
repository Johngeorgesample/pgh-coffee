'use client'

import { useEffect, useState } from 'react'

// Pretend it's Dec 5 so there are both open and upcoming days to look at.
export const TODAY = 5

export const useRevealed = () => {
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const isHidden = (step: number, jar: number) => step > TODAY && !revealed.has(jar)
  const reveal = (jar: number) => setRevealed(prev => new Set(prev).add(jar))
  return { isHidden, reveal }
}

type Props = { step: number; onReveal: () => void; tone?: 'light' | 'dark' }

export function RevealButton({ step, onReveal, tone = 'light' }: Props) {
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (!armed) return
    const t = setTimeout(() => setArmed(false), 4000)
    return () => clearTimeout(t)
  }, [armed])

  const base = tone === 'dark' ? 'text-white/70 hover:text-white' : 'text-stone-500 hover:text-slate-900'

  if (!armed)
    return (
      <span className="group relative inline-flex">
        <button
          onClick={e => { e.preventDefault(); setArmed(true) }}
          aria-describedby={`peek-tip-${step}`}
          className={`text-sm font-medium underline decoration-dotted underline-offset-4 transition-colors ${base}`}
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

  return (
    <span className="proto-rise inline-flex flex-wrap items-center gap-2 text-sm">
      <span className={tone === 'dark' ? 'text-white/80' : 'text-slate-700'}>Spoil Day {step} early?</span>
      <button
        onClick={e => { e.preventDefault(); onReveal() }}
        className={`rounded-full px-3 py-1 font-semibold active:scale-[0.97] ${
          tone === 'dark' ? 'bg-yellow-300 text-gray-950' : 'bg-gray-950 text-white'
        }`}
      >
        Show me
      </button>
      <button
        onClick={e => { e.preventDefault(); setArmed(false) }}
        className={`transition-colors ${base}`}
      >
        Keep it a surprise
      </button>
    </span>
  )
}

export const opensOn = (step: number) => `Opens Dec ${step}`
