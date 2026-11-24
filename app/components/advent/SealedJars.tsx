'use client'

import { useEffect, useRef, useState } from 'react'
import SectionHead from '@/app/components/advent/SectionHead'
import EmptySlot from '@/app/components/advent/sealed-jars/EmptySlot'
import Lid from '@/app/components/advent/sealed-jars/Lid'
import SleepingLid from '@/app/components/advent/sealed-jars/SleepingLid'
import { useAnalytics } from '@/hooks'

type Jar = { step: number; day: number; sealed: boolean }

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
