'use client'

import { useState } from 'react'
import { Eye, Lock } from 'lucide-react'

type Props = { step: number; onReveal: () => void }

const CARD = 'flex items-center justify-between gap-3 rounded-xl border-2 py-1.5 pl-1.5 pr-2 transition-colors duration-150 ease-out'

const Stamp = ({ step, armed }: { step: number; armed: boolean }) => (
  <span
    className={`flex w-12 shrink-0 flex-col items-center rounded-lg border-2 py-1 leading-none ${
      armed ? 'border-gray-950 bg-white text-gray-950' : 'border-gray-950/40 text-gray-500'
    }`}
  >
    <span className="text-[8px] font-bold uppercase tracking-[0.2em]">Dec</span>
    <span className="font-serif text-xl">{step}</span>
  </span>
)

const Confirm = ({ step, onReveal, onCancel }: Props & { onCancel: () => void }) => (
  <div className={`${CARD} animate-arm border-gray-950 bg-yellow-300 shadow-[3px_3px_0_#030712] motion-reduce:animate-none`}>
    <span className="flex items-center gap-3">
      <Stamp step={step} armed />
      <span className="text-sm font-semibold text-gray-950">Spoiler ahead: open it early?</span>
    </span>
    <span className="flex shrink-0 items-center gap-1">
      <button onClick={onCancel} className="rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wide text-gray-900 hover:bg-yellow-200">
        Not yet
      </button>
      <button
        onClick={onReveal}
        className="rounded-lg border-2 border-gray-950 bg-white px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-gray-950 active:scale-[0.97]"
      >
        Show me
      </button>
    </span>
  </div>
)

const Sealed = ({ step, onArm }: { step: number; onArm: () => void }) => (
  <button
    onClick={onArm}
    aria-label={`Peek at Dec ${step} early`}
    className={`group w-full text-left ${CARD} border-dashed border-gray-950/30 hover:border-solid hover:border-gray-950 hover:bg-white`}
  >
    <span className="flex items-center gap-3">
      <Stamp step={step} armed={false} />
      <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-500">
        <Lock className="size-3.5" strokeWidth={2.5} /> Sealed
      </span>
    </span>
    <span className="flex items-center gap-1.5 pr-1 text-xs font-bold uppercase tracking-wide text-gray-400 transition-colors duration-150 ease-out group-hover:text-gray-950">
      <Eye className="size-3.5" strokeWidth={2.5} /> Peek
    </span>
  </button>
)

export default function SealedStop({ step, onReveal }: Props) {
  const [armed, setArmed] = useState(false)

  return armed ? <Confirm step={step} onReveal={onReveal} onCancel={() => setArmed(false)} /> : <Sealed step={step} onArm={() => setArmed(true)} />
}
