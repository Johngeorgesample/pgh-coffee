'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

type Align = 'left' | 'center' | 'right'
type Stage = 'closed' | 'ask' | 'warn' | 'leaving'
type Jar = { step: number; day: number }

const UNSCREW_MS = 350

const LID_TRANSFORM: Record<Stage, string> = {
  closed: 'none',
  ask: 'rotate(-40deg) translateY(-4px)',
  warn: 'rotate(-40deg) translateY(-4px)',
  leaving: 'rotate(-200deg) scale(0.6) translateY(-12px)',
}

const STAGE_ANIMATION: Record<Stage, string> = {
  closed: '',
  ask: '',
  warn: 'animate-buzz motion-reduce:animate-none',
  leaving: 'animate-unscrew motion-reduce:animate-none',
}

const POPOVER_ALIGN: Record<Align, string> = {
  left: 'left-0 origin-bottom-left',
  center: 'left-1/2 -translate-x-1/2 origin-bottom',
  right: 'right-0 origin-bottom-right',
}

const BUTTON = 'rounded-lg border-2 border-gray-950 py-1 text-xs font-bold uppercase tracking-wide text-gray-950 active:scale-[0.97]'

const alignFor = (el: HTMLElement): Align => {
  const box = el.getBoundingClientRect()
  const row = el.closest('ul')!.getBoundingClientRect()
  const center = (box.left + box.width / 2 - row.left) / row.width
  return center < 0.2 ? 'left' : center > 0.8 ? 'right' : 'center'
}

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

const Ask = ({ step, onNext }: { step: number; onNext: () => void }) => (
  <>
    <p className="text-sm font-semibold leading-snug text-gray-950">Peek at Dec {step} early?</p>
    <button autoFocus onClick={onNext} className={`mt-2 w-full bg-yellow-300 ${BUTTON}`}>
      Show me
    </button>
  </>
)

const Warn = ({ onCancel, onAccept }: { onCancel: () => void; onAccept: () => void }) => (
  <>
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-950">
      <span className="bg-yellow-300 px-1">Spoiler ahead</span>
    </p>
    <p className="mt-1.5 text-sm leading-snug text-gray-950">This shows the roaster and coffee before its day. It can&apos;t be resealed.</p>
    <div className="mt-2 grid grid-cols-2 gap-1.5">
      <button onClick={onCancel} className={`bg-white ${BUTTON}`}>
        Not yet
      </button>
      <button autoFocus onClick={onAccept} className={`bg-yellow-300 ${BUTTON}`}>
        Open it
      </button>
    </div>
  </>
)

const Popover = ({ align, children }: { align: Align; children: ReactNode }) => (
  <div
    className={`absolute bottom-full z-20 mb-3 w-52 animate-arm rounded-xl border-2 border-gray-950 bg-white p-3 shadow-[3px_3px_0_#030712] motion-reduce:animate-none ${POPOVER_ALIGN[align]}`}
  >
    {children}
  </div>
)

const useStage = (armed: boolean, onReveal: () => void, onClose: () => void) => {
  const [stage, setStage] = useState<Stage>('ask')
  const unscrew = () => {
    setStage('leaving')
    window.setTimeout(onReveal, prefersReducedMotion() ? 0 : UNSCREW_MS)
  }
  const cancel = () => {
    setStage('ask')
    onClose()
  }
  const current: Stage = stage === 'leaving' ? 'leaving' : armed ? stage : 'closed'
  return { stage: current, warn: () => setStage('warn'), unscrew, cancel, reset: () => setStage('ask') }
}

type TLidProps = { step: number; armed: boolean; onToggle: () => void; onClose: () => void; onReveal: () => void }

const Lid = ({ step, armed, onToggle, onClose, onReveal }: TLidProps) => {
  const [align, setAlign] = useState<Align>('center')
  const { stage, warn, unscrew, cancel, reset } = useStage(armed, onReveal, onClose)
  return (
    <div className="relative">
      <button
        onClick={e => {
          setAlign(alignFor(e.currentTarget.parentElement!))
          reset()
          onToggle()
        }}
        aria-expanded={armed}
        aria-label={`Peek at Dec ${step} early`}
        style={{ transform: LID_TRANSFORM[stage], opacity: stage === 'leaving' ? 0 : 1, transitionDuration: `${UNSCREW_MS}ms` }}
        className={`flex aspect-square w-full items-center justify-center rounded-full border-2 border-gray-950 bg-[repeating-conic-gradient(#030712_0deg_3deg,#fff_3deg_9deg)] shadow-[3px_3px_0_#030712] outline-offset-4 transition-[transform,opacity] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${STAGE_ANIMATION[stage]}`}
      >
        <span
          className={`flex size-[80%] flex-col items-center justify-center rounded-full border-2 border-gray-950 leading-none transition-colors duration-150 ease-out ${
            stage === 'closed' ? 'bg-white' : 'bg-yellow-300'
          }`}
        >
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-900">Dec</span>
          <span className="font-serif text-2xl text-gray-950">{step}</span>
        </span>
      </button>
      {(stage === 'ask' || stage === 'warn') && (
        <Popover key={stage} align={align}>
          {stage === 'ask' ? <Ask step={step} onNext={warn} /> : <Warn onCancel={cancel} onAccept={unscrew} />}
        </Popover>
      )}
    </div>
  )
}

const useDismiss = (active: boolean, close: () => void) => {
  const ref = useRef<HTMLUListElement>(null)
  useEffect(() => {
    if (!active) return
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && close()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  })
  return ref
}

export default function SealedJars({ jars, onReveal }: { jars: Jar[]; onReveal: (day: number) => void }) {
  const [armed, setArmed] = useState<number | null>(null)
  const close = () => setArmed(null)
  const ref = useDismiss(armed !== null, close)
  const toggle = (step: number) => setArmed(current => (current === step ? null : step))
  const open = (jar: Jar) => {
    onReveal(jar.day)
    close()
  }

  return (
    <section className="mt-12 animate-rise motion-reduce:animate-none">
      <div className="flex items-baseline justify-between gap-4 border-b-2 border-gray-950 pb-2">
        <h3 className="font-serif text-2xl tracking-tight text-gray-950">Still sealed</h3>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">{jars.length} jars</p>
      </div>
      <ul ref={ref} className="mt-6 grid grid-cols-5 gap-4 sm:grid-cols-6 md:grid-cols-8">
        {jars.map(jar => (
          <li key={jar.day}>
            <Lid step={jar.step} armed={armed === jar.step} onToggle={() => toggle(jar.step)} onClose={close} onReveal={() => open(jar)} />
          </li>
        ))}
      </ul>
    </section>
  )
}
