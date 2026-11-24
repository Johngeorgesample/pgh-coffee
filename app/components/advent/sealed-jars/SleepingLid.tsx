'use client'

import { useState } from 'react'
import LockedLid from './LockedLid'

export default function SleepingLid({ step, jar, onTap }: { step: number; jar: number; onTap: () => void }) {
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
