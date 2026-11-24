'use client'

import { useEffect, useState } from 'react'
import { PREVIEW_PARAM } from '@/app/utils/advent'
import { storageGet, storageSet } from '@/app/utils/storage'
import { ORDERS } from '@/data/advent-orders'

const KEYS = ['advent:order', 'advent:started', 'advent:visited']

const DAYS = Array.from({ length: 25 }, (_, i) => i + 1)

const reloadWith = (edit: (params: URLSearchParams) => void) => {
  const url = new URL(window.location.href)
  edit(url.searchParams)
  window.location.assign(url)
}

const setDay = (day: string) => reloadWith(params => params.set(PREVIEW_PARAM, day))

const exitPreview = () => reloadWith(params => params.delete(PREVIEW_PARAM))

const setOrder = (id: string) => {
  KEYS.forEach(key => localStorage.removeItem(key))
  if (id) {
    storageSet('advent:order', id)
    storageSet('advent:started', '1')
  }
  window.location.reload()
}

const readState = () => {
  const params = new URLSearchParams(window.location.search)
  return {
    enabled: params.has(PREVIEW_PARAM),
    day: params.get(PREVIEW_PARAM) ?? '',
    order: storageGet('advent:order') ?? '',
  }
}

const usePreviewState = () => {
  const [state, setState] = useState<ReturnType<typeof readState> | null>(null)
  useEffect(() => setState(readState()), [])
  return state
}

const BUTTON = 'rounded-md border border-gray-300 bg-white px-3 py-1.5 font-medium hover:bg-gray-100'

export default function DevPanel() {
  const state = usePreviewState()
  if (!state?.enabled) return null
  return (
    <div className="fixed right-4 bottom-4 left-4 z-50 grid gap-3 rounded-lg border border-gray-300 bg-white/95 p-4 font-sans text-sm text-gray-700 shadow-lg backdrop-blur sm:left-auto sm:w-72">
      <div>
        <p className="font-semibold text-gray-950">Preview mode</p>
        <p className="mt-1 text-gray-500">See the calendar as it will look on any day in December.</p>
      </div>
      <label className="grid gap-1">
        <span className="font-medium">Show the calendar on</span>
        <select value={state.day} onChange={e => setDay(e.target.value)} className="rounded-md border border-gray-300 px-2 py-1.5">
          <option value="">Today</option>
          {DAYS.map(day => <option key={day} value={day}>December {day}</option>)}
        </select>
      </label>
      <label className="grid gap-1">
        <span className="font-medium">Order</span>
        <select value={state.order} onChange={e => setOrder(e.target.value)} className="rounded-md border border-gray-300 px-2 py-1.5">
          <option value="">Not picked yet</option>
          {ORDERS.map(order => <option key={order.id} value={order.id}>{order.label}</option>)}
        </select>
      </label>
      <button onClick={exitPreview} className={`${BUTTON} justify-self-start`}>Exit preview</button>
    </div>
  )
}
