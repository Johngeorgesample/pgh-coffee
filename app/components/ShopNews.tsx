import { useEffect, useMemo, useState } from 'react'
import { TShop } from '@/types/shop-types'
import { data as newsData } from '@/data/news'
import { EventCard, type EventCardData } from './EventCard'

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

const normalize = (u: UpdateEntry): EventCardData => ({
  id: String(u.id ?? u.title),
  title: u.title,
  description: u.description ?? undefined,
  url: u.url ?? undefined,
  post_date: (u.postDate ?? u.post_date) || undefined,
  event_date: (u.eventDate ?? u.event_date) || undefined,
  tags: (u.tags as string[] | null) ?? undefined,
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
    // Filter before normalizing - only show updates tied to THIS shop
    const filtered = shopId
      ? updates.filter(e => (e.shopId ?? e.shop_id) === String(shopId))
      : updates
    return filtered
      .map(normalize)
      .sort((a, b) => {
        const aDate = new Date(a.post_date ?? a.event_date ?? 0).getTime()
        const bDate = new Date(b.post_date ?? b.event_date ?? 0).getTime()
        return bDate - aDate
      })
  }, [updates, shopId])

  // Nothing to show? render nothing.
  if (!relevantNews.length) return null

  return (
    <section className="flex flex-col mt-4 px-4 sm:px-6">
      <hr className="w-1/2 m-auto mt-2 mb-2" />
      <p className="mb-2 text-gray-700">Recent updates</p>

      <ul className="flex flex-col gap-3">
        {relevantNews.map((entry) => (
          <EventCard key={entry.id} entry={entry} hideShopInfo={true} showTime={false} />
        ))}
      </ul>
    </section>
  )
}
