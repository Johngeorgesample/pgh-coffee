export interface NewsItem {
  date: string
  entries: NewsEntry[]
}

export interface NewsEntry {
  type: 'shop' | 'menu' | 'site' | 'event' | 'other'
  tags?: string[]
  title: string
  description?: string
  shopId?: string
  url?: string
  eventDate?: string
}
