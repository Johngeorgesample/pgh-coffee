import { useEffect, useMemo, useState } from 'react'
import { TShop } from '@/types/shop-types'
import { ArrowTopRightOnSquareIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline'
import { fmtYMD } from '@/app/utils/utils'

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

const isPast = (date: string) => {
  return new Date(date).getTime() < Date.now()
}

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
        const res = await fetch(`/api/events?${qs.toString()}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: UpdateEntry[] = await res.json()
        if (!cancelled) setUpdates(data)
      } catch {}
    })()

    return () => {
      cancelled = true
      ac.abort()
    }
  }, [shop, shopId])

  const relevantNews = useMemo(() => {
    if (!updates) return []
    // Filter before normalizing - only show updates tied to THIS shop
    const filtered = shopId
      ? updates.filter(e => (e.shopId ?? e.shop_id) === String(shopId))
      : updates
    return filtered.sort((a, b) => {
      const aDate = new Date((a.postDate ?? a.post_date) ?? (a.eventDate ?? a.event_date) ?? 0).getTime()
      const bDate = new Date((b.postDate ?? b.post_date) ?? (b.eventDate ?? b.event_date) ?? 0).getTime()
      return bDate - aDate
    })
  }, [updates, shopId])

  // Nothing to show? render nothing.
  if (!relevantNews.length) return null

  return (
    <section className="flex flex-col mt-4 px-4 sm:px-6">
      <hr className="w-1/2 m-auto mt-2 mb-2" />
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Recent updates</p>

      <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white">
        {relevantNews.map((entry) => {
          const eventDate = entry.eventDate ?? entry.event_date
          const eventIsPast = eventDate ? isPast(eventDate) : false

          return (
            <li key={entry.id ?? entry.title} className={`p-3 ${eventIsPast ? 'opacity-50' : ''}`}>
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

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500">
                {eventDate && (
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    <span
                      className={eventIsPast ? '' : 'font-semibold'}
                      style={eventIsPast ? {} : { color: 'lab(45 10 50)' }}
                    >
                      {fmtYMD(eventDate)}
                    </span>
                  </span>
                )}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {entry.tags.map((t) => <TagBadge key={t} label={t} />)}
                  </div>
                )}
              </div>

              {entry.description && (
                <p className="mt-2 text-sm text-gray-700">{entry.description}</p>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
