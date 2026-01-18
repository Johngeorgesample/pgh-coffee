import { useEffect, useMemo, useState } from 'react'
import { TShop } from '@/types/shop-types'
import { NewsCard } from '@/app/components/NewsCard'
import { NewsItem } from '@/types/news-types'

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
        const res = await fetch(`/api/updates?${qs.toString()}`)
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
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Updates</p>

      <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white">
        {relevantNews.map((entry) => (
          <NewsCard
            key={entry.id ?? entry.title}
            asLink={true}
            item={entry as NewsItem}
            variant="inline"
            showPastOpacity
          />
        ))}
      </ul>
    </section>
  )
}
