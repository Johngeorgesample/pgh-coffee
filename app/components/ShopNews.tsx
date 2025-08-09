import { TShop } from '@/types/shop-types'
import { NewsEntry } from '@/types/news-types'
import { data as newsData } from '@/data/news'
import { fmtYMD } from '@/app/utils/utils'

export const ShopNews = ({ shop }) => {
  // temp data until TShop has uuid
  shop.id = '6f7bc2f3-7c85-40c6-aa94-1fccb56dbf35'

  // @TODO replace with API call
  const relevantNews = newsData.filter((entry: NewsEntry) => entry.shopId === shop.id)

  relevantNews.sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime())

  return (
    <section className="flex flex-col mt-4 px-4 sm:px-6">
      <hr className="w-1/2 m-auto mt-2 mb-2" />
      <p className="mb-2 text-gray-700">Recent updates</p>
      <ul className="space-y-4">
        {relevantNews.map((news, idx) => (
          <li key={idx}>
            <p className="text-sm text-gray-500">Posted {fmtYMD(news.postDate)}</p>
            <p className="font-semibold">{news.title}</p>
            {news.eventDate && <p className="text-sm text-gray-500">Event date: {fmtYMD(news.eventDate)}</p>}
            {news.description && <p>{news.description}</p>}
            {news.url && (
              <a href={news.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Source
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
