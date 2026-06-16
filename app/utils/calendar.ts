import { EventCardData } from '@/app/components/EventCard'

/**
 * Calendar export helpers for events.
 *
 * Events only carry a date (no time), so they are treated as all-day events.
 * All-day calendar entries use an exclusive end date, so DTEND / the Google
 * `dates` end value is the day after the event.
 */

const toCalDate = (ymd: string) => ymd.replace(/-/g, '')

const nextDay = (ymd: string) => {
  const [y, m, d] = ymd.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d + 1))
  return date.toISOString().slice(0, 10).replace(/-/g, '')
}

const buildLocation = (event: EventCardData) =>
  event.shop ? `${event.shop.name}, ${event.shop.neighborhood}, Pittsburgh, PA` : ''

const buildDescription = (event: EventCardData) =>
  [event.description, event.url].filter(Boolean).join('\n\n')

/**
 * Builds a Google Calendar "create event" URL for an all-day event.
 */
export const buildGoogleCalendarUrl = (event: EventCardData): string => {
  if (!event.event_date) return ''

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toCalDate(event.event_date)}/${nextDay(event.event_date)}`,
  })

  const details = buildDescription(event)
  if (details) params.set('details', details)

  const location = buildLocation(event)
  if (location) params.set('location', location)

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

// Per RFC 5545, long lines fold and certain characters in text values must be escaped.
const escapeICS = (value: string) =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')

/**
 * Builds the contents of an .ics file for an all-day event.
 */
export const buildICS = (event: EventCardData): string => {
  if (!event.event_date) return ''

  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//pgh.coffee//Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@pgh.coffee`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${toCalDate(event.event_date)}`,
    `DTEND;VALUE=DATE:${nextDay(event.event_date)}`,
    `SUMMARY:${escapeICS(event.title)}`,
  ]

  const details = buildDescription(event)
  if (details) lines.push(`DESCRIPTION:${escapeICS(details)}`)

  const location = buildLocation(event)
  if (location) lines.push(`LOCATION:${escapeICS(location)}`)

  if (event.url) lines.push(`URL:${event.url}`)

  lines.push('END:VEVENT', 'END:VCALENDAR')

  return lines.join('\r\n')
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
  link.download = `${event.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
