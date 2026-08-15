import { useEffect, useState } from 'react'
import { TShop } from '@/types/shop-types'
import { NewsCard } from '@/app/components/NewsCard'
import { NewsItem } from '@/types/news-types'

type Props = { shop: TShop }

// /api/updates already filters by shop_id and orders by post_date, so this
// hands back exactly what ShopNews should render — no client-side re-derive.
async function fetchShopUpdates(shopId: string, signal: AbortSignal) {
  const qs = new URLSearchParams({ shop_id: shopId })
  const res = await fetch(`/api/updates?${qs.toString()}`, { signal })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<NewsItem[]>
}

export const ShopNews = ({ shop }: Props) => {
  const [updates, setUpdates] = useState<NewsItem[]>([])
  const shopId = shop.properties.uuid

  useEffect(() => {
    // Clear the previous shop's list before fetching the new one, so a
    // switch between shops can't leave shop A's news rendered under shop B's
    // header — whether B has no updates yet, or its fetch fails outright.
    setUpdates([])
    if (!shopId) return

    const controller = new AbortController()
    fetchShopUpdates(shopId, controller.signal)
      // abort() can't un-settle a request that already resolved, so this
      // guards against that response landing after a newer shop took over.
      .then(data => {
        if (!controller.signal.aborted) setUpdates(data)
      })
      .catch(err => {
        if (err.name !== 'AbortError') console.error(err)
      })

    return () => controller.abort()
  }, [shopId])

  // Nothing to show? render nothing.
  if (!updates.length) return null

  return (
    <section className="flex flex-col border-b border-stone-200 px-4 py-5 sm:px-6">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Updates</p>

      <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white">
        {updates.map((entry) => (
          <NewsCard
            key={entry.id ?? entry.title}
            asLink={true}
            item={entry}
            variant="inline"
            showPastOpacity
          />
        ))}
      </ul>
    </section>
  )
}
