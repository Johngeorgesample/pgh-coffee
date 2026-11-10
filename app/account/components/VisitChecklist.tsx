'use client'

import { useEffect, useMemo, useState } from 'react'
import { Stamp } from 'lucide-react'
import { useAnalytics } from '@/hooks/useAnalytics'
import useShopsStore from '@/stores/coffeeShopsStore'
import type { TFeatureCollection } from '@/types/shop-types'

interface ChecklistShop {
  uuid: string
  name: string
  neighborhood: string
}

const toChecklistShops = (geojson: TFeatureCollection) =>
  geojson.features
    .map(({ properties: { uuid, name, neighborhood } }) => ({ uuid, name, neighborhood }))
    .sort((a, b) => a.name.localeCompare(b.name))

const matchesQuery = (shop: ChecklistShop, query: string) =>
  `${shop.name} ${shop.neighborhood}`.toLowerCase().includes(query.trim().toLowerCase())

const toggled = (selected: Set<string>, uuid: string) => {
  const next = new Set(selected)
  if (!next.delete(uuid)) next.add(uuid)
  return next
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
  const shops = useMemo(() => toChecklistShops(allShops), [allShops])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)
  const [saveNotice, setSaveNotice] = useState<string | null>(null)

  useEffect(() => {
    fetchCoffeeShops().then(() => {
      setLoadError(useShopsStore.getState().allShops.features.length === 0)
      setLoading(false)
    })
  }, [fetchCoffeeShops])

  const visibleShops = shops.filter((shop) => matchesQuery(shop, query))

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
      <div className="p-4 sm:p-6 md:p-8 pb-0 sm:pb-0 md:pb-0">
        <h1 className="text-2xl font-bold text-gray-900">Which of these have you been to?</h1>
        <p className="text-gray-500">Check off the shops you&apos;ve already visited to fill in your passport.</p>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by shop or neighborhood"
          aria-label="Filter shops"
          className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />
      </div>
      <ul className="px-4 sm:px-6 md:px-8 py-2 divide-y divide-gray-100">
        {visibleShops.map((shop) => (
          <li key={shop.uuid}>
            <label className="grid grid-cols-[auto_1fr] items-center gap-x-3 py-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.has(shop.uuid)}
                onChange={() => setSelected((current) => toggled(current, shop.uuid))}
                className="row-span-2 h-5 w-5 rounded border-gray-300 text-yellow-600 focus:ring-yellow-400"
              />
              <span className="font-semibold text-gray-900">{shop.name}</span>
              <span className="text-sm text-gray-500">{shop.neighborhood}</span>
            </label>
          </li>
        ))}
      </ul>
      {visibleShops.length === 0 && <p className="px-4 sm:px-6 md:px-8 pb-6 text-gray-500">No shops match that filter.</p>}
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
