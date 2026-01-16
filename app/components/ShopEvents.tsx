'use client'

import { useEffect, useState } from 'react'
import { TShop } from '@/types/shop-types'
import { EventCard, type EventCardData } from '@/app/components/EventCard'

type EventEntry = {
  id: string
  title: string
  description?: string | null
  url?: string | null
  post_date: string
  event_date?: string | null
  tags?: string[] | null
  shop?: {
    name: string
    neighborhood: string
  }
}

type Props = { shop: TShop }

export const ShopEvents = ({ shop }: Props) => {
  const [events, setEvents] = useState<EventEntry[]>([])
  const [loading, setLoading] = useState(true)
  const shopId = shop.properties.uuid

  useEffect(() => {
    if (!shopId) return

    setLoading(true)
    fetch(`/api/events?shop_id=${shopId}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setEvents(data)
        setLoading(false)
      })
      .catch(() => {
        setEvents([])
        setLoading(false)
      })
  }, [shopId])

  if (loading || !events.length) return null

  return (
    <section className="flex flex-col mt-4 px-4 sm:px-6">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Events</p>

      <ul className="list-none flex flex-col gap-3">
        {events.map((entry) => (
          <EventCard
            key={entry.id}
            entry={entry as EventCardData}
            hideShopInfo
          />
        ))}
      </ul>
    </section>
  )
}
