import { data } from '@/data/news'
import { NewsItem } from '@/types/news-types'

const tags = (item: NewsItem) => {
  console.log(item)
  item?.tags.map(tag => {
    console.log(tag)
  })
}

export const News = () => {
  return (
    <div className="mt-20 px-4 sm:px-6">
      {data.map((item: NewsItem) => (
        <div key={item.date} className="mb-8">
          <p className="text-sm text-gray-500 mb-2">{item.date}</p>
          <ul className="space-y-1">
            {item.entries.map((entry, idx) => (
              <li key={idx} className="text-base">
                <p className="font-semibold">{entry.title}</p>
                <p>{entry.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
