import { ArrowTopRightOnSquareIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline'
import { fmtYMD } from '@/app/utils/utils'

export type NewsCardData = {
  title: string
  description?: string | null
  url?: string | null
  tags?: string[] | null
  post_date?: string | null
  event_date?: string | null
  eventDate?: string | null
}

type TagKey = 'opening' | 'closure' | 'coming soon' | 'throwdown' | 'event' | 'seasonal' | 'menu'

export const TAG_STYLES: Record<TagKey, string> = {
  opening: 'bg-green-100 text-green-800',
  closure: 'bg-red-100 text-red-800',
  'coming soon': 'bg-amber-100 text-amber-800',
  throwdown: 'bg-purple-100 text-purple-800',
  event: 'bg-blue-100 text-blue-800',
  seasonal: 'bg-pink-100 text-pink-800',
  menu: 'bg-slate-100 text-slate-800',
}

export const TagBadge = ({ label }: { label: string }) => {
  const cls = TAG_STYLES[label as TagKey] ?? 'bg-gray-100 text-gray-800'
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${cls}`}>
      <TagIcon className="h-3 w-3" />
      {label}
    </span>
  )
}

const EventDatePill = ({ date }: { date: string }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-800 px-2 py-0.5 text-[11px]">
    <CalendarIcon className="h-3 w-3" />
    {fmtYMD(date)}
  </span>
)

const isPast = (date: string) => {
  return new Date(date).getTime() < Date.now()
}

interface NewsCardProps {
  item: NewsCardData
  variant?: 'pill' | 'inline'
  clampDescription?: boolean
  showPastOpacity?: boolean
  asLink?: boolean
}

export const NewsCard = ({
  item,
  variant = 'pill',
  clampDescription = false,
  showPastOpacity = false,
  asLink = false,
}: NewsCardProps) => {
  const eventDate = item.eventDate ?? item.event_date
  const eventIsPast = eventDate ? isPast(eventDate) : false

  const cardContent = (
    <div className={`p-3 ${showPastOpacity && eventIsPast ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-900">{item.title}</h3>
        {item.url && !asLink && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-gray-500 hover:text-gray-700"
            aria-label="Source"
            title="Source"
          >
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </a>
        )}
        {asLink && item.url && (
          <ArrowTopRightOnSquareIcon className="h-4 w-4 shrink-0 text-gray-500 transition-colors group-hover:text-gray-700" />
        )}
      </div>

      {variant === 'pill' ? (
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {eventDate && <EventDatePill date={eventDate} />}
          {item.tags?.map((t) => <TagBadge key={t} label={t} />)}
        </div>
      ) : (
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500">
          {eventDate && (
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span
                className={eventIsPast ? '' : 'font-semibold'}
                style={eventIsPast ? {} : { color: 'lab(45 10 50)' }}
              >
                {fmtYMD(eventDate)}
              </span>
            </span>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {item.tags.map((t) => <TagBadge key={t} label={t} />)}
            </div>
          )}
        </div>
      )}

      {item.description && (
        <p className={`mt-2 text-sm text-gray-700 ${clampDescription ? 'line-clamp-2' : ''}`}>
          {item.description}
        </p>
      )}
    </div>
  )

  if (asLink && item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-lg transition-colors hover:bg-gray-50"
      >
        {cardContent}
      </a>
    )
  }

  return <li>{cardContent}</li>
}
