'use client'

import { useEffect, useMemo, useState } from 'react'
import { TShop } from '@/types/shop-types'
import { EventCard, type EventCardData } from '@/app/components/EventCard'

type EventEntry = {
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
  shop?: {
    name: string
    neighborhood: string
  }
}

type Props = { shop: TShop }

export const ShopEvents = ({ shop }: Props) => {
  const [events, setEvents] = useState<EventEntry[] | null>(null)
  const shopId = shop.properties.uuid

  useEffect(() => {
    if (!shopId) {
      setEvents([])
      return
    }

    let cancelled = false
    const ac = new AbortController()

    ;(async () => {
      try {
        const qs = new URLSearchParams({ shop_id: String(shopId) })
        const res = await fetch(`/api/events?${qs.toString()}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: EventEntry[] = await res.json()
        if (!cancelled) setEvents(data)
      } catch {}
    })()

    return () => {
      cancelled = true
      ac.abort()
    }
  }, [shop, shopId])

  const relevantEvents = useMemo(() => {
    if (!events) return []
    // Filter before normalizing - only show events tied to THIS shop
    const filtered = shopId
      ? events.filter(e => (e.shopId ?? e.shop_id) === String(shopId))
      : events
    return filtered.sort((a, b) => {
      const aDate = new Date((a.eventDate ?? a.event_date) ?? 0).getTime()
      const bDate = new Date((b.eventDate ?? b.event_date) ?? 0).getTime()
      return bDate - aDate
    })
  }, [events, shopId])

  // Nothing to show? render nothing.
  if (!relevantEvents.length) return null

  return (
    <section className="flex flex-col mt-4 px-4 sm:px-6">
      <hr className="w-1/2 m-auto mt-2 mb-2" />
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Upcoming events</p>

      <ul className="flex flex-col gap-3">
        {relevantEvents.map((entry) => (
          <EventCard
            key={entry.id ?? entry.title}
            entry={entry as EventCardData}
            asLink={true}
            showDescription={true}
            showNewPill={true}
            hideShopInfo={true}
          />
        ))}
      </ul>
    </section>
  )
}
