'use client'

import { useEffect, useState } from 'react'

const KEYS = ['advent:order', 'advent:started', 'advent:visited']

const DAYS = Array.from({ length: 25 }, (_, i) => i + 1)

const reloadWith = (edit: (params: URLSearchParams) => void) => {
  const url = new URL(window.location.href)
  edit(url.searchParams)
  window.location.assign(url)
}

const setDay = (day: string) => reloadWith(params => (day ? params.set('dev-day', day) : params.delete('dev-day')))

const forget = () => {
  KEYS.forEach(key => localStorage.removeItem(key))
  window.location.reload()
}

const BUTTON = 'rounded border border-gray-300 bg-white px-2 py-1 hover:bg-gray-100'

const FLAG = 'advent:dev'

declare global {
  interface Window {
    adventDev?: (on?: boolean) => void
  }
}

const readState = () => ({
  day: new URLSearchParams(window.location.search).get('dev-day') ?? '',
  stored: KEYS.map(key => localStorage.getItem(key) ?? '—'),
})

const useToggle = () => {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    setEnabled(localStorage.getItem(FLAG) === '1')
    window.adventDev = (on = true) => {
      if (on) localStorage.setItem(FLAG, '1')
      else localStorage.removeItem(FLAG)
      setEnabled(on)
    }
    return () => {
      delete window.adventDev
    }
  }, [])
  return enabled
}

export default function DevPanel() {
  const enabled = useToggle()
  if (!enabled) return null
  const state = readState()
  return (
    <div className="fixed right-4 bottom-4 z-50 grid w-60 gap-2 rounded-lg border border-gray-300 bg-white/95 p-3 font-sans text-xs text-gray-700 shadow-lg backdrop-blur">
      <p className="font-bold uppercase tracking-widest text-gray-500">Advent dev</p>
      <label className="flex items-center justify-between gap-2">
        Pretend it&rsquo;s
        <select value={state.day} onChange={e => setDay(e.target.value)} className="rounded border border-gray-300 px-1 py-0.5">
          <option value="">Real date</option>
          {DAYS.map(day => <option key={day} value={day}>Dec {day}</option>)}
        </select>
      </label>
      <p>Picked: <b>{state.stored[0]}</b> · started day <b>{state.stored[1]}</b></p>
      <div className="flex flex-wrap gap-1.5">
        <button onClick={forget} className={BUTTON}>Forget pick</button>
      </div>
    </div>
  )
}
