'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronRight, Stamp } from 'lucide-react'
import { useAnalytics } from '@/hooks/useAnalytics'
import useShopsStore from '@/stores/coffeeShopsStore'
import type { TFeatureCollection } from '@/types/shop-types'

interface ChecklistShop {
  uuid: string
  name: string
  neighborhood: string
}

const groupByNeighborhood = (geojson: TFeatureCollection) => {
  const groups = new Map<string, ChecklistShop[]>()
  geojson.features
    .map(({ properties: { uuid, name, neighborhood } }) => ({ uuid, name, neighborhood }))
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((shop) => groups.set(shop.neighborhood, [...(groups.get(shop.neighborhood) ?? []), shop]))
  return Array.from(groups.entries()).sort(([a, as], [b, bs]) => bs.length - as.length || a.localeCompare(b))
}

const withAll = (selected: Set<string>, keys: string[], on: boolean) => {
  const next = new Set(selected)
  keys.forEach((key) => (on ? next.add(key) : next.delete(key)))
  return next
}

function NeighborhoodGroup({
  name,
  shops,
  selected,
  onSelect,
}: {
  name: string
  shops: ChecklistShop[]
  selected: Set<string>
  onSelect: (uuids: string[], on: boolean) => void
}) {
  const [open, setOpen] = useState(false)
  const uuids = shops.map((shop) => shop.uuid)
  const count = uuids.filter((uuid) => selected.has(uuid)).length

  return (
    <li>
      <div className="flex items-center gap-3 py-3">
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex flex-1 items-center gap-2 text-left">
          <ChevronRight className={`h-4 w-4 text-gray-400 ${open ? 'rotate-90' : ''}`} />
          <span className="font-semibold text-gray-900">{name}</span>
          <span className="text-sm text-gray-500">{shops.length} shops</span>
        </button>
        {count > 0 && <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">{count} ✓</span>}
      </div>
      {open && (
        <div className="pb-3 pl-6">
          <button
            type="button"
            onClick={() => onSelect(uuids, count < uuids.length)}
            className="mb-1 text-sm font-medium text-yellow-600 hover:text-yellow-700"
          >
            {count < uuids.length ? `I've been to all of them` : 'Clear'}
          </button>
          {shops.map((shop) => (
            <label key={shop.uuid} className="flex items-center gap-3 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.has(shop.uuid)}
                onChange={() => onSelect([shop.uuid], !selected.has(shop.uuid))}
                className="h-5 w-5 rounded border-gray-300 text-yellow-600 focus:ring-yellow-400"
              />
              <span className="text-gray-900">{shop.name}</span>
            </label>
          ))}
        </div>
      )}
    </li>
  )
}

async function saveVisits(shopUUIDs: string[]) {
  const res = await fetch('/api/visits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shopUUIDs }),
  })
  if (!res.ok) throw new Error(`Failed to save visits: ${res.status}`)
  const saved: unknown[] = await res.json()
  return saved.length
}

const SAVE_FAILED = "Couldn't save your visits. Please try again."
const REFRESH_FAILED = 'Your visits were saved. Refresh the page to see your passport.'

export default function VisitChecklist({ onSaved, onSkip }: { onSaved: () => Promise<void>; onSkip: () => void }) {
  const plausible = useAnalytics()
  const allShops = useShopsStore((state) => state.allShops)
  const fetchCoffeeShops = useShopsStore((state) => state.fetchCoffeeShops)
  const groups = useMemo(() => groupByNeighborhood(allShops), [allShops])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)
  const [saveNotice, setSaveNotice] = useState<string | null>(null)

  useEffect(() => {
    fetchCoffeeShops().then(() => {
      setLoadError(useShopsStore.getState().allShops.features.length === 0)
      setLoading(false)
    })
  }, [fetchCoffeeShops])

  const saveAndRefresh = async () => {
    try {
      const count = await saveVisits(Array.from(selected))
      plausible('PassportBackfill', { props: { count } })
    } catch (err) {
      console.error('Failed to save visits:', err)
      return SAVE_FAILED
    }
    return onSaved().then(
      () => null,
      (err) => {
        console.error('Failed to refresh visits:', err)
        return REFRESH_FAILED
      },
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveNotice(null)
    const notice = await saveAndRefresh()
    if (notice) {
      setSaveNotice(notice)
      setSaving(false)
    }
  }

  const handleSkip = () => {
    plausible('PassportBackfillSkip')
    onSkip()
  }

  if (loading) return <div>Loading...</div>

  if (loadError) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Stamp className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Couldn&apos;t load the shop list</h3>
          <p className="text-gray-500 max-w-sm">
            Something went wrong while loading shops. Please try refreshing the page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg">
      <div className="p-4 sm:p-6 md:p-8 pb-2 sm:pb-2 md:pb-2">
        <h1 className="text-2xl font-bold text-gray-900">Where do you usually get coffee?</h1>
        <p className="text-gray-500">Open a neighborhood and check off the shops you&apos;ve been to.</p>
      </div>
      <ul className="px-4 sm:px-6 md:px-8 py-2 divide-y divide-gray-100">
        {groups.map(([name, shops]) => (
          <NeighborhoodGroup
            key={name}
            name={name}
            shops={shops}
            selected={selected}
            onSelect={(uuids, on) => setSelected((current) => withAll(current, uuids, on))}
          />
        ))}
      </ul>
      <div className="sticky bottom-0 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-b-2xl border-t border-gray-200 bg-white px-4 sm:px-6 md:px-8 py-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={selected.size === 0 || saving}
          className="rounded-lg py-3 px-4 text-sm font-semibold text-black bg-yellow-300 hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Saving…' : `Add ${selected.size} to passport`}
        </button>
        <button type="button" onClick={handleSkip} className="text-sm font-medium text-gray-500 hover:text-gray-700">
          Skip
        </button>
        {saveNotice && (
          <p role="alert" className="text-sm text-red-600">
            {saveNotice}
          </p>
        )}
      </div>
    </div>
  )
}
