import { EventCardData } from '@/app/components/EventCard'

/**
 * Calendar export helpers for events.
 *
 * Events with a start_time export as timed entries in UTC; without one they
 * are all-day entries, which use an exclusive end date (the day after).
 */

const toCalDate = (ymd: string) => ymd.replace(/-/g, '')

const nextDay = (ymd: string) => {
  const [y, m, d] = ymd.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d + 1))
  return date.toISOString().slice(0, 10).replace(/-/g, '')
}

const toUTCStamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

const easternOffset = (ymd: string) =>
  new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', timeZoneName: 'longOffset' })
    .formatToParts(new Date(`${ymd}T12:00:00Z`))
    .find(part => part.type === 'timeZoneName')!.value.slice(3)

const easternToDate = (ymd: string, time: string) => new Date(`${ymd}T${time.slice(0, 5)}:00${easternOffset(ymd)}`)

const ONE_HOUR = 60 * 60 * 1000

const timedSpan = (ymd: string, startTime: string, endTime?: string | null) => {
  const start = easternToDate(ymd, startTime)
  const end = endTime ? easternToDate(ymd, endTime) : new Date(start.getTime() + ONE_HOUR)
  return { start: toUTCStamp(start), end: toUTCStamp(end) }
}

const eventSpan = (ymd: string, event: EventCardData) =>
  event.start_time
    ? { ...timedSpan(ymd, event.start_time, event.end_time), allDay: false }
    : { start: toCalDate(ymd), end: nextDay(ymd), allDay: true }

// ponytail: only catches "123 Main St, Town, PA 15213"-shaped addresses; a geocoder if formats get messier
const STREET_ADDRESS = /\b\d+[A-Za-z]?(?: [A-Z][A-Za-z.]*)+, [A-Z][A-Za-z ]+, PA \d{5}/

const buildLocation = (event: EventCardData) =>
  event.description?.match(STREET_ADDRESS)?.[0] ??
  (event.shop ? `${event.shop.name}, ${event.shop.neighborhood}, Pittsburgh, PA` : event.roaster?.name ?? '')

const buildDescription = (event: EventCardData) =>
  [event.description, event.url].filter(Boolean).join('\n\n')

/**
 * Builds a Google Calendar "create event" URL.
 */
export const buildGoogleCalendarUrl = (event: EventCardData): string => {
  if (!event.event_date) return ''

  const span = eventSpan(event.event_date, event)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${span.start}/${span.end}`,
  })

  const details = buildDescription(event)
  if (details) params.set('details', details)

  const location = buildLocation(event)
  if (location) params.set('location', location)

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

const encoder = new TextEncoder()

// RFC 5545 caps lines at 75 bytes; each continuation line starts with a space that counts toward it.
// Iterating by code point keeps multi-byte characters like "–" from being split.
const foldLine = (line: string) => {
  const chunks = ['']
  for (const char of line) {
    const limit = chunks.length === 1 ? 75 : 74
    if (encoder.encode(chunks[chunks.length - 1] + char).length > limit) chunks.push('')
    chunks[chunks.length - 1] += char
  }
  return chunks.join('\r\n ')
}

// RFC 5545 requires these characters to be escaped in TEXT values.
const escapeICS = (value: string) =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n')

/**
 * Builds the contents of an .ics file.
 */
export const buildICS = (event: EventCardData): string => {
  if (!event.event_date) return ''

  const stamp = toUTCStamp(new Date())
  const span = eventSpan(event.event_date, event)
  const dateParam = span.allDay ? ';VALUE=DATE' : ''
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//pgh.coffee//Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@pgh.coffee`,
    `DTSTAMP:${stamp}`,
    `DTSTART${dateParam}:${span.start}`,
    `DTEND${dateParam}:${span.end}`,
    `SUMMARY:${escapeICS(event.title)}`,
  ]

  const details = buildDescription(event)
  if (details) lines.push(`DESCRIPTION:${escapeICS(details)}`)

  const location = buildLocation(event)
  if (location) lines.push(`LOCATION:${escapeICS(location)}`)

  if (event.url) lines.push(`URL:${event.url}`)

  lines.push('END:VEVENT', 'END:VCALENDAR')

  return lines.map(foldLine).join('\r\n')
}

/**
 * Triggers a browser download of the event as an .ics file.
 */
export const downloadICS = (event: EventCardData): void => {
  const ics = buildICS(event)
  if (!ics) return

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${event.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
