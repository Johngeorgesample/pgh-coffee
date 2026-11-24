'use client'

import { useState } from 'react'
import LockedLid from './LockedLid'

export default function SleepingLid({ step, jar, onTap }: { step: number; jar: number; onTap: () => void }) {
  const [tapped, setTapped] = useState(false)
  const [buzzing, setBuzzing] = useState(false)
  const tap = () => {
    onTap()
    setTapped(true)
    setBuzzing(true)
  }
  return (
    <button onClick={tap} onAnimationEnd={() => setBuzzing(false)} aria-label={`Jar ${step}, sealed`} className="block w-full">
      <LockedLid jar={jar} className={buzzing ? 'animate-buzz motion-reduce:animate-none' : ''} />
      <span aria-live="polite" className="sr-only">
        {tapped ? `Opens Dec ${step}` : ''}
      </span>
    </button>
  )
}
