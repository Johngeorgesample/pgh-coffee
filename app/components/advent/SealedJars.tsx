'use client'

import Image from 'next/image'
import { ReactNode, useEffect, useRef, useState } from 'react'
import SectionHead from '@/app/components/advent/SectionHead'

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

type TActionsProps = { accept: string; onCancel: () => void; onAccept: () => void }

const Actions = ({ accept, onCancel, onAccept }: TActionsProps) => (
  <div className="mt-2 grid grid-cols-2 gap-1.5">
    <button onClick={onCancel} className={`bg-white ${BUTTON}`}>
      Nevermind
    </button>
    <button autoFocus onClick={onAccept} className={`bg-yellow-300 ${BUTTON}`}>
      {accept}
    </button>
  </div>
)

const Ask = ({ step, onCancel, onNext }: { step: number; onCancel: () => void; onNext: () => void }) => (
  <>
    <p className="text-sm font-semibold leading-snug text-gray-950">Open Dec {step} early?</p>
    <Actions accept="Open it" onCancel={onCancel} onAccept={onNext} />
  </>
)

const Warn = ({ onCancel, onAccept }: { onCancel: () => void; onAccept: () => void }) => (
  <>
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-950">
      <span className="bg-yellow-300 px-1">Spoiler ahead</span>
    </p>
    <p className="mt-1.5 text-sm leading-snug text-gray-950">No take-backs: the roaster and coffee are on the next page.</p>
    <Actions accept="Open anyway" onCancel={onCancel} onAccept={onAccept} />
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

const LID = 'block aspect-square w-full overflow-hidden rounded-full border-2 border-gray-950 shadow-[3px_3px_0_#030712]'

const Label = ({ step }: { step: number }) => (
  <Image src={`/advent/labels/${step}.webp`} alt="" width={240} height={240} sizes="96px" className="size-full" />
)

export const LockedLid = ({ step, className = '', children }: { step: number; className?: string; children?: ReactNode }) => (
  <span className={`${LID} ${className}`}>
    {children}
    <Label step={step} />
  </span>
)

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
        aria-label={`Open Dec ${step} early`}
        style={{ transform: LID_TRANSFORM[stage], opacity: stage === 'leaving' ? 0 : 1, transitionDuration: `${UNSCREW_MS}ms` }}
        className={`${LID} outline-offset-4 transition-[transform,opacity] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${STAGE_ANIMATION[stage]}`}
      >
        <Label step={step} />
      </button>
      {(stage === 'ask' || stage === 'warn') && (
        <Popover key={stage} align={align}>
          {stage === 'ask' ? <Ask step={step} onCancel={cancel} onNext={warn} /> : <Warn onCancel={cancel} onAccept={unscrew} />}
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

type TSealedJarsProps = { jars: Jar[]; locked: boolean; onReveal: (day: number) => void }

export default function SealedJars({ jars, locked, onReveal }: TSealedJarsProps) {
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
      <SectionHead title="Still sealed" count={jars.length} />
      <ul ref={ref} className="mt-6 grid grid-cols-5 gap-4 sm:grid-cols-6 md:grid-cols-8">
        {jars.map(jar => (
          <li key={jar.day}>
            {locked ? (
              <LockedLid step={jar.step} />
            ) : (
              <Lid step={jar.step} armed={armed === jar.step} onToggle={() => toggle(jar.step)} onClose={close} onReveal={() => open(jar)} />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
