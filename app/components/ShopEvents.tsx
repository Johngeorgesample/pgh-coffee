'use client'

import { useEffect, useReducer } from 'react'
import { TShop } from '@/types/shop-types'
import { EventCard } from '@/app/components/EventCard'
import type { EventCardData } from '@/types/event-types'

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

interface State {
  events: EventEntry[]
  loading: boolean
}

type Action =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; events: EventEntry[] }
  | { type: 'LOAD_ERROR' }

const initialState: State = { events: [], loading: true }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true }
    case 'LOAD_SUCCESS':
      return { events: action.events, loading: false }
    case 'LOAD_ERROR':
      return { events: [], loading: false }
    default:
      return state
  }
}

const loadEvents = async (shopId: string): Promise<EventEntry[]> => {
  const res = await fetch(`/api/events?shop_id=${shopId}`)
  if (!res.ok) return []
  return res.json()
}

type Props = { shop: TShop }

export const ShopEvents = ({ shop }: Props) => {
  const [{ events, loading }, dispatch] = useReducer(reducer, initialState)
  const shopId = shop.properties.uuid

  useEffect(() => {
    if (!shopId) return
    let cancelled = false
    dispatch({ type: 'LOAD_START' })
    loadEvents(shopId)
      .then(data => {
        if (!cancelled) dispatch({ type: 'LOAD_SUCCESS', events: data })
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: 'LOAD_ERROR' })
      })
    return () => {
      cancelled = true
    }
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
