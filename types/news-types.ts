export interface NewsEntry {
  postDate: string
  type: 'shop' | 'menu' | 'site' | 'event' | 'other'
  tags?: string[]
  title: string
  description?: string
  shopId?: string
  url?: string
  eventDate?: string
}

export interface Event {
  postDate: string
  type: string
  tags?: string[]
  title: string
  description?: string
  shopId?: string
  shop: any
  url?: string
  event_date?: string
  id: string
}
