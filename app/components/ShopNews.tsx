import { useEffect, useMemo, useState } from 'react'
import { TShop } from '@/types/shop-types'
import { data as newsData } from '@/data/news'
import { fmtYMD } from '@/app/utils/utils'
import { ArrowTopRightOnSquareIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline'

type TagKey = 'opening' | 'closure' | 'coming soon' | 'throwdown' | 'event' | 'seasonal' | 'menu'
const TAG_STYLES: Record<TagKey, string> = {
  opening: 'bg-green-100 text-green-800',
  closure: 'bg-red-100 text-red-800',
  'coming soon': 'bg-amber-100 text-amber-800',
  throwdown: 'bg-purple-100 text-purple-800',
  event: 'bg-blue-100 text-blue-800',
  seasonal: 'bg-pink-100 text-pink-800',
  menu: 'bg-slate-100 text-slate-800',
}

const TagBadge = ({ label }: { label: string }) => {
  const cls = TAG_STYLES[label as TagKey] ?? 'bg-gray-100 text-gray-800'
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${cls}`}>
      <TagIcon className="h-3 w-3" />
      {label}
    </span>
  )
}

const EventDatePill = ({ date }: { date: string }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-800 px-2 py-0.5 text-[11px]">
    <CalendarIcon className="h-3 w-3" />
    {fmtYMD(date)}
  </span>
)

type UpdateEntry = {
  id?: string | number
  title: string
  description?: string | null
  url?: string | null
  post_date?: string | null
  event_date?: string | null
  postDate?: string | null
  eventDate?: string | null
  tags?: string[] | null
  shop_id?: string | null
  shopId?: string | null
}

const normalize = (u: UpdateEntry) => ({
  title: u.title,
  description: u.description ?? undefined,
  url: u.url ?? undefined,
  postDate: (u.postDate ?? u.post_date) || undefined,
  eventDate: (u.eventDate ?? u.event_date) || undefined,
  tags: (u.tags as string[] | null) ?? undefined,
  shopId: (u.shopId ?? u.shop_id) || undefined,
})

type Props = { shop: TShop }

export const ShopNews = ({ shop }: Props) => {
  const [updates, setUpdates] = useState<UpdateEntry[] | null>(null)
  const shopId = shop.properties.uuid

  useEffect(() => {
    if (!shopId) {
      setUpdates([])
      return
    }

    let cancelled = false
    const ac = new AbortController()

    ;(async () => {
      try {
        const qs = new URLSearchParams({ shop_id: String(shopId) })
        const res = await fetch(`/api/events?${qs.toString()}`, {
          cache: 'no-store',
          signal: ac.signal,
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: UpdateEntry[] = await res.json()
        if (!cancelled) setUpdates(data)
      } catch {
        // fallback to bundled data if API fails
        if (!cancelled) setUpdates((newsData as any[]) ?? [])
      }
    })()

    return () => {
      cancelled = true
      ac.abort()
    }
  }, [shopId])

  const relevantNews = useMemo(() => {
    if (!updates) return []
    const list = updates.map(normalize)
    // Only show updates tied to THIS shop
    const filtered = shopId ? list.filter(e => e.shopId === String(shopId)) : list
    return filtered
      .slice()
      .sort((a, b) => {
        const aDate = new Date(a.postDate ?? a.eventDate ?? 0).getTime()
        const bDate = new Date(b.postDate ?? b.eventDate ?? 0).getTime()
        return bDate - aDate
      })
  }, [updates, shopId])

  // Nothing to show? render nothing.
  if (!relevantNews.length) return null

  return (
    <section className="flex flex-col mt-4 px-4 sm:px-6">
      <hr className="w-1/2 m-auto mt-2 mb-2" />
      <p className="mb-2 text-gray-700">Recent updates</p>

      <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white">
        {relevantNews.map((entry, i) => (
          <li key={entry.title + i} className="p-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-gray-900">{entry.title}</h3>
              {entry.url && (
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-gray-500 hover:text-gray-700"
                  aria-label="Source"
                  title="Source"
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </a>
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              {(entry.eventDate ?? entry.postDate) && (
                <EventDatePill date={(entry.eventDate ?? entry.postDate)!} />
              )}
              {entry.tags?.map(t => (
                <TagBadge key={t} label={t} />
              ))}
            </div>

            {entry.description && (
              <p className="mt-2 text-sm text-gray-700">{entry.description}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
