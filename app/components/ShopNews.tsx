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

const loadShopUpdates = async (shopId: string): Promise<UpdateEntry[]> => {
  const qs = new URLSearchParams({ shop_id: String(shopId) })
  const res = await fetch(`/api/updates?${qs.toString()}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

type Props = { shop: TShop }

export const ShopNews = ({ shop }: Props) => {
  const [updates, setUpdates] = useState<UpdateEntry[] | null>(null)
  const shopId = shop.properties.uuid

  useEffect(() => {
    if (!shopId) return

    let cancelled = false
    loadShopUpdates(shopId)
      .then(data => {
        if (!cancelled) setUpdates(data)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [shopId])

  const relevantNews = useMemo(() => {
    if (!updates || !shopId) return []
    // Filter before normalizing - only show updates tied to THIS shop
    const filtered = updates.filter(e => (e.shopId ?? e.shop_id) === String(shopId))
    return filtered.toSorted((a, b) => {
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
