// `requires` names the column the report is worthless without, so the form knows
// which input to reveal and the route knows what to reject. 'closed' needs nothing
// beyond the shop id — the report type *is* the content.
export const REPORT_TYPES = {
  hours: { label: 'The hours are wrong', requires: 'details' },
  closed: { label: 'This shop has permanently closed', requires: null },
  website: { label: 'The website is wrong', requires: 'reported_website' },
  other: { label: 'Something else', requires: 'details' },
} as const

export type ReportType = keyof typeof REPORT_TYPES

export const isReportType = (value: unknown): value is ReportType =>
  typeof value === 'string' && value in REPORT_TYPES
