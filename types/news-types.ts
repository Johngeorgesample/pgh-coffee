export interface NewsItem {
  date: string // ISO format, e.g. "2025-08-07"
  entries: NewsEntry[]
}

export interface NewsEntry {
  type: 'shop' | 'menu' | 'site' | 'event' | 'other'
  tags?: string[]
  title: string
  description?: string
  shopId?: string
  url?: string
}
