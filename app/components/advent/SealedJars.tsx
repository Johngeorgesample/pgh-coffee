'use client'

import Image from 'next/image'
import { ReactNode, useEffect, useRef, useState } from 'react'
import SectionHead from '@/app/components/advent/SectionHead'
import { useAnalytics } from '@/hooks'

type Align = 'left' | 'center' | 'right'
type Stage = 'closed' | 'ask' | 'warn' | 'leaving'
type Jar = { step: number; day: number; sealed: boolean }

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

const BUTTON = 'rounded-lg border-2 border-gray-950 py-1 [@media(pointer:coarse)]:py-2 text-xs font-bold uppercase tracking-wide text-gray-950 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]'

const alignFor = (el: HTMLElement) => {
  const box = el.getBoundingClientRect()
  const row = el.closest('ul')!.getBoundingClientRect()
  const center = (box.left + box.width / 2 - row.left) / row.width
  return center < 0.2 ? 'left' : center > 0.8 ? 'right' : 'center'
}

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

const useStage = (armed: boolean, onReveal: () => void, onClose: () => void, onPrefetch: () => void) => {
  const [stage, setStage] = useState<Stage>('ask')
  const warn = () => {
    setStage('warn')
    onPrefetch()
  }
  const unscrew = () => {
    setStage('leaving')
    onReveal()
  }
  const cancel = () => {
    setStage('ask')
    onClose()
  }
  const current: Stage = stage === 'leaving' ? 'leaving' : armed ? stage : 'closed'
  return { stage: current, warn, unscrew, cancel, reset: () => setStage('ask') }
}

const LID = 'block aspect-square w-full overflow-hidden rounded-full border-2 border-gray-950 shadow-[3px_3px_0_#030712]'

const Label = ({ jar }: { jar: number }) => (
  <Image src={`/advent/labels/${jar}.webp`} alt="" width={240} height={240} sizes="96px" className="size-full" />
)

export const LockedLid = ({ jar, className = '', children }: { jar: number; className?: string; children?: ReactNode }) => (
  <span className={`${LID} ${className}`}>
    {children}
    <Label jar={jar} />
  </span>
)

const SleepingLid = ({ step, jar, onTap }: { step: number; jar: number; onTap: () => void }) => {
  const [taps, setTaps] = useState(0)
  const tap = () => {
    onTap()
    setTaps(n => n + 1)
  }
  return (
    <button onClick={tap} aria-label={`Jar ${step}, sealed`} className="block w-full">
      <LockedLid key={taps} jar={jar} className={taps ? 'animate-buzz motion-reduce:animate-none' : ''} />
      <span aria-live="polite" className="sr-only">
        {taps ? `Opens Dec ${step}` : ''}
      </span>
    </button>
  )
}

const EmptySlot = ({ className = '' }: { className?: string }) => (
  <span className={`block aspect-square w-full rounded-full border-2 border-dashed border-gray-950/30 ${className}`} />
)

type TLidProps = {
  step: number
  jar: number
  armed: boolean
  onToggle: () => void
  onClose: () => void
  onReveal: () => void
  onPrefetch: () => void
  onWarned: (choice: 'accept' | 'cancel') => void
}

const Lid = ({ step, jar, armed, onToggle, onClose, onReveal, onPrefetch, onWarned }: TLidProps) => {
  const [align, setAlign] = useState<Align>('center')
  const { stage, warn, unscrew, cancel, reset } = useStage(armed, onReveal, onClose, onPrefetch)
  const decide = (choice: 'accept' | 'cancel') => {
    onWarned(choice)
    if (choice === 'accept') unscrew()
    else cancel()
  }
  return (
    <div className="relative">
      {stage === 'leaving' && <EmptySlot className="absolute inset-0 animate-pulse motion-reduce:animate-none" />}
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
        <Label jar={jar} />
      </button>
      <span aria-live="polite" className="sr-only">
        {stage === 'leaving' ? `Opening Dec ${step}` : ''}
      </span>
      {(stage === 'ask' || stage === 'warn') && (
        <Popover key={stage} align={align}>
          {stage === 'ask' ? <Ask step={step} onCancel={cancel} onNext={warn} /> : <Warn onCancel={() => decide('cancel')} onAccept={() => decide('accept')} />}
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

type TSealedJarsProps = { jars: Jar[]; open: number; locked: boolean; onReveal: (day: number) => void; onPrefetch: (day: number) => void }

export default function SealedJars({ jars, open: daysOpen, locked, onReveal, onPrefetch }: TSealedJarsProps) {
  const [armed, setArmed] = useState<number | null>(null)
  const track = useAnalytics()
  const close = () => setArmed(null)
  const ref = useDismiss(armed !== null, close)
  const tapped = (step: number) => track('AdventSealedJarTapped', { props: { step, daysEarly: step - daysOpen, locked } })
  const warned = (step: number, choice: string) => track('AdventSpoilerWarning', { props: { step, daysEarly: step - daysOpen, choice } })
  const toggle = (step: number) => {
    if (armed !== step) tapped(step)
    setArmed(armed === step ? null : step)
  }
  const open = (jar: Jar) => {
    onReveal(jar.day)
    close()
  }

  return (
    <section data-reveal className="mt-12 animate-rise motion-reduce:animate-none">
      <SectionHead title="Still sealed" count={jars.filter(jar => jar.sealed).length} />
      <ul ref={ref} className="mx-auto mt-6 grid max-w-xl grid-cols-5 gap-4">
        {jars.map(jar => (
          <li key={jar.day} aria-hidden={!jar.sealed || undefined}>
            {!jar.sealed ? (
              <EmptySlot />
            ) : locked ? (
              <SleepingLid step={jar.step} jar={jar.day} onTap={() => tapped(jar.step)} />
            ) : (
              <Lid
                step={jar.step}
                jar={jar.day}
                armed={armed === jar.step}
                onToggle={() => toggle(jar.step)}
                onClose={close}
                onReveal={() => open(jar)}
                onPrefetch={() => onPrefetch(jar.day)}
                onWarned={choice => warned(jar.step, choice)}
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
