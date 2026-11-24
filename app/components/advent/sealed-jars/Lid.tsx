'use client'

import { useState } from 'react'
import EmptySlot from './EmptySlot'
import LidPopover, { Align, Ask, Warn } from './LidPopover'
import { LID, Label } from './LockedLid'

type Stage = 'closed' | 'ask' | 'warn' | 'leaving'

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

const alignFor = (el: HTMLElement) => {
  const box = el.getBoundingClientRect()
  const row = el.closest('ul')!.getBoundingClientRect()
  const center = (box.left + box.width / 2 - row.left) / row.width
  return center < 0.2 ? 'left' : center > 0.8 ? 'right' : 'center'
}

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

export default function Lid({ step, jar, armed, onToggle, onClose, onReveal, onPrefetch, onWarned }: TLidProps) {
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
        style={{
          transform: LID_TRANSFORM[stage],
          opacity: stage === 'leaving' ? 0 : 1,
          transitionDuration: `${UNSCREW_MS}ms`,
        }}
        className={`${LID} outline-offset-4 transition-[transform,opacity] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${STAGE_ANIMATION[stage]}`}
      >
        <Label jar={jar} />
      </button>
      <span aria-live="polite" className="sr-only">
        {stage === 'leaving' ? `Opening Dec ${step}` : ''}
      </span>
      {(stage === 'ask' || stage === 'warn') && (
        <LidPopover key={stage} align={align}>
          {stage === 'ask' ? (
            <Ask step={step} onCancel={cancel} onNext={warn} />
          ) : (
            <Warn onCancel={() => decide('cancel')} onAccept={() => decide('accept')} />
          )}
        </LidPopover>
      )}
    </div>
  )
}
