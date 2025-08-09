import { data } from '@/data/news'
import { NewsEntry } from '@/types/news-types'
import { fmtYMD } from '@/app/utils/utils'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

const Tags = ({ entry }: { entry: NewsEntry }) => {
  if (!entry.tags) return null
  return (
    <div className="flex gap-2 my-1">
      {entry.tags.map(tag => (
        <span key={tag} className="text-xs bg-gray-200 px-2 py-0.5 rounded">
          {tag}
        </span>
      ))}
    </div>
  )
}

export const News = () => {
  return (
    <div className="mt-20 px-4 sm:px-6">
      {data.map((entry: NewsEntry, idx: number) => (
        <div key={idx} className="mb-8">
          <p className="text-sm text-gray-500 mb-2">
            Posted {fmtYMD(entry.postDate)}
          </p>

          <p className="font-semibold">{entry.title}</p>
          <Tags entry={entry} />
          {entry.eventDate && (
            <p className="text-sm text-gray-500">
              Event date: {fmtYMD(entry.eventDate)}
            </p>
          )}
          {entry.description && <p>{entry.description}</p>}

          {entry.url && (
            <a
              className="text-blue-500 flex items-center"
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Source
              <ArrowTopRightOnSquareIcon
                className="ml-1 h-4 w-4"
                aria-hidden="true"
              />
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
